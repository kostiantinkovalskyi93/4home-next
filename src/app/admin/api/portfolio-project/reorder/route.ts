import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type ReorderPortfolioProjectsBody = {
  projectIds?: unknown;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_PATTERN.test(value);
}

export async function POST(request: Request) {
  const supabase = await createClient();

  // ----------------------------------------------------------
  // 1. Authentication
  // ----------------------------------------------------------

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      {
        error:
          "Потрібна авторизація адміністратора.",
      },
      {
        status: 401,
      },
    );
  }

  // ----------------------------------------------------------
  // 2. Authorization
  // ----------------------------------------------------------

  const {
    data: admin,
    error: adminError,
  } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError) {
    console.error(
      "Failed to verify portfolio reorder admin:",
      adminError,
    );

    return NextResponse.json(
      {
        error:
          "Не вдалося перевірити права адміністратора.",
      },
      {
        status: 500,
      },
    );
  }

  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Недостатньо прав адміністратора.",
      },
      {
        status: 403,
      },
    );
  }

  // ----------------------------------------------------------
  // 3. Parse request
  // ----------------------------------------------------------

  const body = (await request
    .json()
    .catch(() => null)) as
    | ReorderPortfolioProjectsBody
    | null;

  if (!body) {
    return NextResponse.json(
      {
        error:
          "Некоректний запит на зміну порядку робіт.",
      },
      {
        status: 400,
      },
    );
  }

  const projectIds = body.projectIds;

  // ----------------------------------------------------------
  // 4. Validate payload
  // ----------------------------------------------------------

  if (
    !Array.isArray(projectIds) ||
    projectIds.length === 0
  ) {
    return NextResponse.json(
      {
        error:
          "Список робіт для сортування порожній або некоректний.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    projectIds.some(
      (id) =>
        typeof id !== "string" ||
        !isUuid(id),
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Список робіт містить некоректний ID.",
      },
      {
        status: 400,
      },
    );
  }

  const normalizedProjectIds =
    projectIds as string[];

  if (
    new Set(normalizedProjectIds).size !==
    normalizedProjectIds.length
  ) {
    return NextResponse.json(
      {
        error:
          "Список робіт містить дублікати.",
      },
      {
        status: 400,
      },
    );
  }

  // ----------------------------------------------------------
  // 5. Transactional database reorder
  //
  // Database RPC additionally verifies:
  // - auth.uid()
  // - admin_users membership
  // - complete global project set
  // - duplicate IDs
  // - unknown IDs
  // - final normalized 0..N-1 order
  //
  // It returns the actual number of updated rows.
  // ----------------------------------------------------------

  const {
    data: updatedCount,
    error: reorderError,
  } = await supabase.rpc(
    "reorder_portfolio_projects",
    {
      p_project_ids:
        normalizedProjectIds,
    },
  );

  if (reorderError) {
    console.error(
      "Failed to reorder portfolio projects:",
      reorderError,
    );

    const databaseMessage =
      reorderError.message ?? "";

    // The admin may have loaded the page before another
    // project was created/deleted. In that case the submitted
    // array is no longer the complete source-of-truth set.
    if (
      databaseMessage.includes(
        "project_order_must_include_all_projects",
      ) ||
      databaseMessage.includes(
        "unknown_project_id",
      ) ||
      databaseMessage.includes(
        "portfolio_reorder_incomplete",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Список робіт змінився. Оновіть сторінку та повторіть сортування.",
        },
        {
          status: 409,
        },
      );
    }

    if (
      databaseMessage.includes(
        "duplicate_project_ids",
      ) ||
      databaseMessage.includes(
        "empty_project_order",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Некоректний порядок робіт.",
        },
        {
          status: 400,
        },
      );
    }

    if (
      databaseMessage.includes(
        "authentication_required",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Потрібна авторизація адміністратора.",
        },
        {
          status: 401,
        },
      );
    }

    if (
      databaseMessage.includes(
        "admin_required",
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Недостатньо прав адміністратора.",
        },
        {
          status: 403,
        },
      );
    }

    return NextResponse.json(
      {
        error:
          "Не вдалося зберегти порядок робіт.",
      },
      {
        status: 500,
      },
    );
  }

  // ----------------------------------------------------------
  // 6. Verify mutation result
  // ----------------------------------------------------------

  if (
    typeof updatedCount !== "number" ||
    updatedCount !==
      normalizedProjectIds.length
  ) {
    console.error(
      "Portfolio reorder returned unexpected result:",
      {
        expected:
          normalizedProjectIds.length,
        actual: updatedCount,
      },
    );

    return NextResponse.json(
      {
        error:
          "База даних повернула неповний результат сортування.",
      },
      {
        status: 500,
      },
    );
  }

  // ----------------------------------------------------------
  // 7. Refresh affected routes only after confirmed success
  // ----------------------------------------------------------

  revalidatePath("/admin/portfolio");
  revalidatePath("/portfolio");

  return NextResponse.json({
    ok: true,
    updatedCount,
  });
}