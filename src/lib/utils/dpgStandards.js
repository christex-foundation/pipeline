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

// Criteria whose failure corresponds to missing repo files. Must stay in sync
// with CRITERION_REQUIRED_FILES in src/lib/server/service/criterionCheckService.js.
// The UI uses this to decide whether to show the "Check missing files" button.
export const fileBasedCriteria = new Set(['Use of Approved Open Licenses', 'Documentation']);

export function isFileBasedCriterion(name) {
  return fileBasedCriteria.has(name);
}
