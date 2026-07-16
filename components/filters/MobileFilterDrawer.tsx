"use client";

import { useState } from "react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import type { ResolvedFacets } from "@/lib/woocommerce/types";
import { FiltersSidebar } from "@/components/filters/FiltersSidebar";

export function MobileFilterDrawer({ facets }: { facets: ResolvedFacets }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Filtres
      </Button>

      <Drawer open={open} onClose={() => setOpen(false)} side="bottom" title="Filtres">
        <div className="p-4">
          <FiltersSidebar facets={facets} />
          <Button className="mt-4 w-full" onClick={() => setOpen(false)}>
            Voir les résultats
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
