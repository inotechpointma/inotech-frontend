import { wooFetch } from "./client";

export interface WCGlobalAttribute {
  id: number;
  name: string;
  slug: string; // e.g. "pa_socket", "pa_ram"
}

export interface WCAttributeTerm {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export async function getGlobalAttributes(): Promise<WCGlobalAttribute[]> {
  const { data } = await wooFetch<WCGlobalAttribute[]>("/products/attributes", { per_page: 100 }, {
    tags: ["attributes"],
  });
  return data;
}

export async function getAttributeTerms(attributeId: number): Promise<WCAttributeTerm[]> {
  const { data } = await wooFetch<WCAttributeTerm[]>(
    `/products/attributes/${attributeId}/terms`,
    { per_page: 100, hide_empty: false },
    { tags: ["attributes"] },
  );
  return data;
}
