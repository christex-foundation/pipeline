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
