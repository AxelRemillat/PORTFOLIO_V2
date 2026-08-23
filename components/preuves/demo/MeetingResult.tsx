"use client";

// Rendu dédié « compte rendu de réunion » (thème clair, accent indigo de l'onglet).
// Contrat n8n : result{ titre, resume, decisions[], actions[{tache,responsable,
// echeance}], points_ouverts[] } + transcript (sibling de result).
export interface MeetingAction { tache: string; responsable: string; echeance: string }
export interface MeetingData {
  titre: string;
  resume: string;
  decisions: string[];
  actions: MeetingAction[];
  points_ouverts: string[];
}

export default function MeetingResult({ result, transcript }: { result: MeetingData; transcript?: string }) {
  return (
    <>
      <h3 className="wc-mr-title">{result.titre}</h3>
      <p className="wc-mr-resume">{result.resume}</p>

      {result.decisions?.length > 0 && (
        <>
          <p className="wc-res-lbl">Décisions</p>
          <ul className="wc-res-keys">{result.decisions.map((d, i) => <li key={`d${i}`}>{d}</li>)}</ul>
        </>
      )}

      {result.actions?.length > 0 && (
        <>
          <p className="wc-res-lbl">Actions</p>
          <div className="wc-mr-tablewrap">
            <table className="wc-mr-table">
              <thead><tr><th>Tâche</th><th>Responsable</th><th>Échéance</th></tr></thead>
              <tbody>
                {result.actions.map((a, i) => (
                  <tr key={`a${i}`}><td>{a.tache}</td><td>{a.responsable}</td><td>{a.echeance}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {result.points_ouverts?.length > 0 && (
        <>
          <p className="wc-res-lbl">Points ouverts</p>
          <ul className="wc-res-keys">{result.points_ouverts.map((p, i) => <li key={`p${i}`}>{p}</li>)}</ul>
        </>
      )}

      {transcript && (
        <details className="wc-mr-transcript">
          <summary>Voir la transcription</summary>
          <p>{transcript}</p>
        </details>
      )}
    </>
  );
}
