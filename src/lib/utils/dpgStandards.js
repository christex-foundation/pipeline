// Icon map for the 9 DPG standards. Keep this list aligned with the
// criterion names emitted by the DPG evaluator.
export const standardIcons = {
  'Relevance to Sustainable Development Goals (SDGs)': 'mdi:earth',
  'Use of Approved Open Licenses': 'mdi:license',
  'Clear Ownership': 'mdi:account-check',
  'Platform Independence': 'mdi:devices',
  Documentation: 'mdi:file-document',
  'Mechanism for Extracting Data and Content': 'mdi:database-export',
  'Adherence to Privacy and Applicable Laws': 'mdi:shield-lock',
  'Adherence to Standards & Best Practices': 'mdi:check-circle',
  'Do No Harm By Design': 'mdi:heart-plus',
};

export function getIconForStandard(name) {
  return standardIcons[name] || 'mdi:checkbox-marked-circle';
}

// Criteria whose failure typically corresponds to missing repo files. The UI
// uses this to decide whether to show the "Recommended files" block sourced
// from the evaluator's per-criterion recommendation.
export const fileBasedCriteria = new Set(['Use of Approved Open Licenses', 'Documentation']);

export function isFileBasedCriterion(name) {
  return fileBasedCriteria.has(name);
}

// 1-based criterion index, matching the order in the dpg-evaluator output
// (priorityActions[].criterion). Used to look up cross-criterion suggestions
// from dpgStatus.priorityActions for a given criterion name.
export const criterionNumber = {
  'Relevance to Sustainable Development Goals (SDGs)': 1,
  'Use of Approved Open Licenses': 2,
  'Clear Ownership': 3,
  'Platform Independence': 4,
  Documentation: 5,
  'Mechanism for Extracting Data and Content': 6,
  'Adherence to Privacy and Applicable Laws': 7,
  'Adherence to Standards & Best Practices': 8,
  'Do No Harm By Design': 9,
};

export function getCriterionNumber(name) {
  return criterionNumber[name];
}
