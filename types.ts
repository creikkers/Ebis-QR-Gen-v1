export interface EbisFormData {
  waybillSeries: string;        // 2. İrsaliye Seri Numarası
  taxNumber: string;            // 3. Üretici Firma Vergi Numarası
  dispatchDate: string;         // 4. Sevk Tarihi ve Saati
  amountCurrent: string;        // 5a. Beton Miktarı (İrsaliye)
  amountTotal: string;          // 5b. Beton Miktarı (Toplam)
  strengthClass: string;        // 6. Beton Dayanım Sınıfı
  developmentRatio: string;     // 7. 7/28 Gün Dayanım Gelişim Oranı
  slumpClass: string;           // 8. Kıvam Sınıfı
  densityClass: string;         // 9. Yoğunluk Sınıfı
  chlorideClass: string;        // 10. Klorür İçeriği Sınıfı
  maxAggregateSize: string;     // 11. Agreganın en büyük tane büyüklüğü (Dmax)
  waterCementRatio: string;     // 12. Su / Çimento Oranı
  licensePlate: string;         // 13. Araç Plaka No
  cementType: string;           // 14. Çimento Tipi
  chemicalAdmixture: string;    // 15. Kimyasal Katkı Tipi
  mineralAdmixture: string;     // 16. Mineral Katkı Tipi
  fibers: string;               // 17. Lifler
}

export enum DensityType {
  Normal = 'N',
  Light = 'H',
  Heavy = 'A'
}