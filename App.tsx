import React, { useState, useMemo, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QrCode, FileText, Database, Truck, Beaker, Info, Download, Moon, Sun, Lock, Copy, Check } from 'lucide-react';
import { EbisFormData, DensityType } from './types';
import { generateEbisString, generateDisplayString } from './utils/formatter';
import { FormInput } from './components/FormInput';
import { DEFAULT_FORM_DATA } from './constants';

const App: React.FC = () => {
  const [formData, setFormData] = useState<EbisFormData>(DEFAULT_FORM_DATA);
  const [lockedFields, setLockedFields] = useState<Record<string, boolean>>({});
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [isBase64Copied, setIsBase64Copied] = useState(false);

  // Initialize theme based on system preference or previous session could go here
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    // Prevent changes if locked
    if (lockedFields[name]) return;
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleLock = (field: string) => {
    setLockedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Generate the raw string with actual ASCII 29 characters for the QR code
  const qrString = useMemo(() => generateEbisString(formData), [formData]);
  
  // Generate the display string with <GS> tags for the UI preview
  const displayString = useMemo(() => generateDisplayString(formData), [formData]);

  const downloadQR = () => {
    const canvas = document.getElementById('ebis-qr-code') as HTMLCanvasElement;
    if (canvas) {
      // The canvas is already rendered at high resolution (size=500) thanks to the QRCodeCanvas props below
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `EBIS_Karekod_${formData.waybillSeries}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const copyBase64 = async () => {
    const canvas = document.getElementById('ebis-qr-code') as HTMLCanvasElement;
    if (canvas) {
      try {
        const base64 = canvas.toDataURL('image/png');
        await navigator.clipboard.writeText(base64);
        setIsBase64Copied(true);
        setTimeout(() => setIsBase64Copied(false), 2000);
      } catch (err) {
        console.error('Base64 kopyalama hatası:', err);
        alert('Kopyalama başarısız oldu.');
      }
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} py-8 px-4 sm:px-6 lg:px-8`}>
      
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-10">
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-3 rounded-full shadow-lg transition-all ${isDarkMode ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
          aria-label="Karanlık Modu Değiştir"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      {/* Header */}
      <header className="max-w-6xl mx-auto mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="bg-blue-700 p-2 rounded-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            EBİS Karekod Oluşturucu
          </h1>
        </div>
        <p className={`max-w-2xl mx-auto ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Elektronik Beton İzleme Sistemi standartlarına uygun, otomatik &lt;GS&gt; (Grup Ayracı) yönetimi içeren karekod oluşturma aracı.
        </p>
        <div className={`mt-2 text-sm flex items-center justify-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          <Lock size={12} />
          <span>Sabit kalması gereken bilgileri kilitleyebilirsiniz.</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Section */}
        <div className={`lg:col-span-2 rounded-xl shadow-md border overflow-hidden ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>İrsaliye Detayları</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Group 1: Identification */}
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Info className="w-3 h-3" /> Kimlik Bilgileri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormInput
                  id="waybillSeries"
                  name="waybillSeries"
                  label="2. İrsaliye Seri Numarası"
                  value={formData.waybillSeries}
                  onChange={handleChange}
                  placeholder="örn. A123456"
                  required
                  isLocked={lockedFields['waybillSeries']}
                  onToggleLock={() => toggleLock('waybillSeries')}
                />
                 <FormInput
                  id="taxNumber"
                  name="taxNumber"
                  label="3. Üretici Vergi No"
                  value={formData.taxNumber}
                  onChange={handleChange}
                  placeholder="10 haneli"
                  required
                  isLocked={lockedFields['taxNumber']}
                  onToggleLock={() => toggleLock('taxNumber')}
                />
                <FormInput
                  id="dispatchDate"
                  name="dispatchDate"
                  label="4. Sevk Tarihi ve Saati"
                  type="datetime-local"
                  value={formData.dispatchDate}
                  onChange={handleChange}
                  required
                  isLocked={lockedFields['dispatchDate']}
                  onToggleLock={() => toggleLock('dispatchDate')}
                />
              </div>
            </div>

            {/* Group 2: Concrete Specs */}
            <div className={`md:col-span-2 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Database className="w-3 h-3" /> Beton Özellikleri
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                 <FormInput
                  id="amountCurrent"
                  name="amountCurrent"
                  label="5a. Miktar (İrsaliye)"
                  value={formData.amountCurrent}
                  onChange={handleChange}
                  type="number"
                  placeholder="m³"
                  isLocked={lockedFields['amountCurrent']}
                  onToggleLock={() => toggleLock('amountCurrent')}
                />
                <FormInput
                  id="amountTotal"
                  name="amountTotal"
                  label="5b. Miktar (Toplam)"
                  value={formData.amountTotal}
                  onChange={handleChange}
                  type="number"
                  placeholder="m³"
                  isLocked={lockedFields['amountTotal']}
                  onToggleLock={() => toggleLock('amountTotal')}
                />
                 <FormInput
                  id="strengthClass"
                  name="strengthClass"
                  label="6. Dayanım Sınıfı"
                  value={formData.strengthClass}
                  onChange={handleChange}
                  placeholder="örn. C50"
                  isLocked={lockedFields['strengthClass']}
                  onToggleLock={() => toggleLock('strengthClass')}
                />
                <FormInput
                  id="developmentRatio"
                  name="developmentRatio"
                  label="7. Gelişim Oranı (7/28)"
                  value={formData.developmentRatio}
                  onChange={handleChange}
                  placeholder="örn. 0,7"
                  helperText="Virgül kullanınız"
                  isLocked={lockedFields['developmentRatio']}
                  onToggleLock={() => toggleLock('developmentRatio')}
                />
                <FormInput
                  id="slumpClass"
                  name="slumpClass"
                  label="8. Kıvam Sınıfı"
                  value={formData.slumpClass}
                  onChange={handleChange}
                  placeholder="örn. S3"
                  isLocked={lockedFields['slumpClass']}
                  onToggleLock={() => toggleLock('slumpClass')}
                />
                <FormInput
                  id="densityClass"
                  name="densityClass"
                  label="9. Yoğunluk Sınıfı"
                  value={formData.densityClass}
                  onChange={handleChange}
                  options={[
                    { label: 'Normal (N)', value: DensityType.Normal },
                    { label: 'Hafif (H)', value: DensityType.Light },
                    { label: 'Ağır (A)', value: DensityType.Heavy },
                  ]}
                  isLocked={lockedFields['densityClass']}
                  onToggleLock={() => toggleLock('densityClass')}
                />
                <FormInput
                  id="chlorideClass"
                  name="chlorideClass"
                  label="10. Klorür Sınıfı"
                  value={formData.chlorideClass}
                  onChange={handleChange}
                  placeholder="örn. CL 0,2"
                  isLocked={lockedFields['chlorideClass']}
                  onToggleLock={() => toggleLock('chlorideClass')}
                />
                 <FormInput
                  id="maxAggregateSize"
                  name="maxAggregateSize"
                  label="11. Dmax (mm)"
                  value={formData.maxAggregateSize}
                  onChange={handleChange}
                  placeholder="örn. 22,4"
                  isLocked={lockedFields['maxAggregateSize']}
                  onToggleLock={() => toggleLock('maxAggregateSize')}
                />
              </div>
            </div>

             {/* Group 3: Mix Design & Vehicle */}
             <div className={`md:col-span-2 border-t pt-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
               <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Beaker className="w-3 h-3" /> Karışım & Nakliye
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormInput
                  id="waterCementRatio"
                  name="waterCementRatio"
                  label="12. Su/Çimento Oranı"
                  value={formData.waterCementRatio}
                  onChange={handleChange}
                  placeholder="örn. 0,41"
                  isLocked={lockedFields['waterCementRatio']}
                  onToggleLock={() => toggleLock('waterCementRatio')}
                />
                 <FormInput
                  id="licensePlate"
                  name="licensePlate"
                  label="13. Araç Plaka No"
                  value={formData.licensePlate}
                  onChange={handleChange}
                  placeholder="örn. 06EBS01"
                  className="uppercase"
                  isLocked={lockedFields['licensePlate']}
                  onToggleLock={() => toggleLock('licensePlate')}
                />
                <FormInput
                  id="cementType"
                  name="cementType"
                  label="14. Çimento Tipi"
                  value={formData.cementType}
                  onChange={handleChange}
                  placeholder="Maks. 30 karakter"
                  isLocked={lockedFields['cementType']}
                  onToggleLock={() => toggleLock('cementType')}
                />
                <FormInput
                  id="chemicalAdmixture"
                  name="chemicalAdmixture"
                  label="15. Kimyasal Katkı"
                  value={formData.chemicalAdmixture}
                  onChange={handleChange}
                  placeholder="Maks. 30 karakter"
                  isLocked={lockedFields['chemicalAdmixture']}
                  onToggleLock={() => toggleLock('chemicalAdmixture')}
                />
                 <FormInput
                  id="mineralAdmixture"
                  name="mineralAdmixture"
                  label="16. Mineral Katkı"
                  value={formData.mineralAdmixture}
                  onChange={handleChange}
                  placeholder="Maks. 30 karakter"
                  isLocked={lockedFields['mineralAdmixture']}
                  onToggleLock={() => toggleLock('mineralAdmixture')}
                />
                 <FormInput
                  id="fibers"
                  name="fibers"
                  label="17. Lifler"
                  value={formData.fibers}
                  onChange={handleChange}
                  placeholder="-"
                  isLocked={lockedFields['fibers']}
                  onToggleLock={() => toggleLock('fibers')}
                />
              </div>
            </div>

          </div>
        </div>

        {/* Preview Section */}
        <div className="flex flex-col gap-6">
          
          {/* QR Card */}
          <div className={`rounded-xl shadow-md border overflow-hidden sticky top-6 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`px-6 py-4 border-b flex items-center gap-2 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
               <Truck className="w-5 h-5 text-orange-600" />
               <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Oluşturulan Karekod</h2>
            </div>
            
            <div className={`p-6 flex flex-col items-center justify-center min-h-[300px] ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="border-4 border-gray-900 p-2 bg-white rounded-sm mb-4">
                <QRCodeCanvas
                  id="ebis-qr-code"
                  value={qrString}
                  size={500} // 500px çözünürlük, ~4.2cm @ 300DPI. İndirilen dosya yüksek kaliteli olacak.
                  level={'L'} // PDF Gereksinimi: Hata Düzeltme Seviyesi L (Sayfa 6)
                  includeMargin={true} // PDF Gereksinimi: Sessiz Bölge (Quite Zone) (Sayfa 6)
                  style={{ width: '200px', height: '200px' }} // Ekranda önizleme için boyut kısıtlaması
                />
              </div>
              
              <button 
                onClick={downloadQR}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium text-sm shadow-sm"
              >
                <Download className="w-4 h-4" />
                PNG İndir (Yüksek Çözünürlük)
              </button>
            </div>

            {/* Data Verification Box */}
            <div className={`p-4 text-xs font-mono break-all border-t ${isDarkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-800 text-gray-100 border-gray-700'}`}>
               <div className="uppercase text-gray-500 font-bold mb-1">Kodlanmış Veri Önizlemesi</div>
               {displayString}
            </div>
             <div className={`p-3 text-xs border-t ${isDarkMode ? 'bg-yellow-900/30 text-yellow-200 border-yellow-900/50' : 'bg-yellow-50 text-yellow-800 border-yellow-100'}`}>
              <strong>Not:</strong> &lt;GS&gt; ifadesi, EBİS standardı gereği kullanılan ancak ekranda görünmeyen ASCII 29 karakterini temsil eder.
            </div>

            {/* Base64 Copy Button */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
               <button 
                 onClick={copyBase64}
                 className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors font-medium text-sm shadow-sm border ${
                   isDarkMode 
                     ? 'bg-gray-700 hover:bg-gray-600 text-white border-gray-600' 
                     : 'bg-white hover:bg-gray-50 text-gray-700 border-gray-300'
                 }`}
               >
                 {isBase64Copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                 {isBase64Copied ? 'Base64 Kopyalandı!' : 'Base64 Olarak Kopyala'}
               </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
};

export default App;