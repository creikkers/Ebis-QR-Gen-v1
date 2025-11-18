import { EbisFormData } from '../types';
import { GS, EBIS_HEADER } from '../constants';

/**
 * Formats the ISO date string (YYYY-MM-DDTHH:mm) into the EBİS format YYYYAAGGSSDD
 * YYYY: Year
 * AA: Month (01-12)
 * GG: Day (01-31)
 * SS: Hour (00-23)
 * DD: Minute (00-59)
 */
const formatEbisDate = (isoDate: string): string => {
  if (!isoDate) return '';
  const date = new Date(isoDate);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}${hour}${minute}`;
};

export const generateEbisString = (data: EbisFormData): string => {
  const parts = [
    EBIS_HEADER,                                // 1. Header
    data.waybillSeries,                         // 2. Serial
    data.taxNumber,                             // 3. Tax
    formatEbisDate(data.dispatchDate),          // 4. Date
    `${data.amountCurrent}/${data.amountTotal}`,// 5. Amount (Vehicle/Total)
    data.strengthClass,                         // 6. Strength
    data.developmentRatio,                      // 7. Ratio
    data.slumpClass,                            // 8. Slump
    data.densityClass,                          // 9. Density
    data.chlorideClass,                         // 10. Chloride
    data.maxAggregateSize,                      // 11. Dmax
    data.waterCementRatio,                      // 12. W/C Ratio
    data.licensePlate,                          // 13. Plate
    data.cementType,                            // 14. Cement Type
    data.chemicalAdmixture,                     // 15. Chemical
    data.mineralAdmixture,                      // 16. Mineral
    data.fibers                                 // 17. Fibers
  ];

  // Join all parts with the Group Separator (ASCII 29)
  return parts.join(GS);
};

/**
 * Creates a display-friendly version of the string where <GS> is visible
 * for debugging purposes as shown in the PDF example.
 */
export const generateDisplayString = (data: EbisFormData): string => {
  const rawString = generateEbisString(data);
  // Replace the invisible ASCII 29 with the visible string "<GS>"
  return rawString.replace(new RegExp(GS, 'g'), '<GS>');
};