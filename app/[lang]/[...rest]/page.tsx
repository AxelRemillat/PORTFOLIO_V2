import { notFound } from "next/navigation";
import { getLocale } from "@/lib/i18n/server";

/**
 * Toute URL inconnue arrive ici (le proxy réécrit « /nimporte » en « /fr/nimporte »).
 * Le layout `[lang]` étant la racine, c'est ce relais qui déclenche la 404 DANS la
 * bonne langue — sans recourir à `global-not-found`, encore expérimental.
 */
export default async function CatchAll({ params }: { params: Promise<{ lang: string; rest: string[] }> }) {
  await getLocale(params);
  notFound();
}
