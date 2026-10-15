// Agent devis (Cowork #45) : email en texte brut, livraison cohérente partout.
import { test } from "node:test";
import assert from "node:assert/strict";
import { getMetier } from "@/lib/metiers";
import { calculer_devis } from "@/lib/agent/tools";
import { plainEmail } from "@/lib/agent/plain";
import { AGENT_TEXT_FR } from "@/lib/agent/text";
import { AGENT_TEXT_EN } from "@/lib/agent/text.en";

test("email : le Markdown est retiré (gras, titres, puces), le texte reste", () => {
  const brut = "Hello,\n\n## Your quote\n**Subtotal (excl. VAT): €3,240**\n* 6 shutters\n__Total__: €3,888\n\nBest regards";
  assert.equal(plainEmail(brut), "Hello,\n\nYour quote\nSubtotal (excl. VAT): €3,240\n- 6 shutters\nTotal: €3,888\n\nBest regards");
  assert.ok(!/\*|^#/m.test(plainEmail("**a** ** b __ c\n# d")));
});

test("6 volets électriques 120 cm à Lyon : livraison offerte au-delà du franco, seuil exposé par l'outil", () => {
  const m = getMetier("menuiserie", "fr")!;
  const d = calculer_devis(m, { lignes: [{ ref: "VR-ELEC-120", quantite: 6 }, { ref: "POSE-VR", quantite: 6 }], ville: "Lyon" });
  assert.ok(d.sous_total_ht >= 3000, String(d.sous_total_ht));
  assert.equal(d.frais_livraison, 0);
  assert.equal(d.livraison_offerte, true);
  assert.equal(d.franco, 3000);
});

test("petite commande : frais de livraison facturés, pas « offerte »", () => {
  const m = getMetier("menuiserie", "fr")!;
  const d = calculer_devis(m, { lignes: [{ ref: "VR-ELEC-120", quantite: 1 }], ville: "Lyon" });
  assert.equal(d.livraison_offerte, false);
  assert.equal(d.frais_livraison, 90);
});

test("carte « Zone de livraison » : la règle de gratuité est écrite (FR et EN)", () => {
  assert.match(AGENT_TEXT_FR.summary.zone(2, 90, 3000), /^2 j · 90 € HT \(offerte dès 3\s000 € HT\)$/);
  assert.equal(AGENT_TEXT_EN.summary.zone(2, 90, 3000), "2 days · €90 excl. VAT (free on orders over €3,000 excl. VAT)");
  assert.equal(AGENT_TEXT_FR.summary.zone(2, 90, null), "2 j · 90 € HT");
});
