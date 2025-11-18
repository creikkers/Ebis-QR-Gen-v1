// ASCII 29 Group Separator
// Defined in the document as <GS>
export const GS = '\u001D';

// Field 1: Fixed EBİS Identifier and Version
export const EBIS_HEADER = 'E1';

// Default initial state matching the PDF example on Page 11
export const DEFAULT_FORM_DATA = {
  waybillSeries: 'A123456',
  taxNumber: '0123456789',
  dispatchDate: '2019-09-25T13:30', // Matches example 25.09.2019 13:30:42
  amountCurrent: '12',
  amountTotal: '60',
  strengthClass: 'C50',
  developmentRatio: '0,7',
  slumpClass: 'S3',
  densityClass: 'N',
  chlorideClass: 'CL 0,2',
  maxAggregateSize: '22,4',
  waterCementRatio: '0,41',
  licensePlate: '06EBS01',
  cementType: 'CEM II/A-S 42,5 N',
  chemicalAdmixture: 'YAPICHEM DEGASET AX 4117',
  mineralAdmixture: 'ÖĞÜTÜLMÜŞ GRANÜLE Y. F. CÜRUFU',
  fibers: '-'
};