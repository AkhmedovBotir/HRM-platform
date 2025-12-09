import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import SearchableSelect from './SearchableSelect';

export default function FilterPanel({ 
  isOpen, 
  filters, 
  onFilterChange, 
  companies, 
  departments, 
  positions 
}) {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      status: '',
      type: '',
      daraja: '',
      skills: '',
      companyId: '',
      departmentId: '',
      positionId: '',
      minApplicationCount: '',
      sortBy: '',
      sortOrder: '',
      page: 1,
      limit: 20
    };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-6 overflow-hidden"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Status
              </label>
              <select
                value={localFilters.status || ''}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Barchasi</option>
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ish turi
              </label>
              <select
                value={localFilters.type || ''}
                onChange={(e) => handleChange('type', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Barchasi</option>
                <option value="fulltime">To'liq</option>
                <option value="parttime">Yarim</option>
              </select>
            </div>

            {/* Daraja Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Daraja
              </label>
              <select
                value={localFilters.daraja || ''}
                onChange={(e) => handleChange('daraja', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Barchasi</option>
                <option value="tajribasiz">Tajribasiz</option>
                <option value="boshlang'ich">Boshlang'ich</option>
                <option value="orta">Orta</option>
                <option value="yuqori">Yuqori</option>
              </select>
            </div>

            {/* Company Filter */}
            <SearchableSelect
              label="Kompaniya"
              value={localFilters.companyId || ''}
              onChange={(value) => handleChange('companyId', value)}
              options={companies}
              placeholder="Kompaniya nomi bo'yicha qidiring..."
              emptyText="Kompaniya topilmadi"
              allText="Barchasi"
            />

            {/* Department Filter */}
            <SearchableSelect
              label="Bo'lim"
              value={localFilters.departmentId || ''}
              onChange={(value) => handleChange('departmentId', value)}
              options={departments}
              placeholder="Bo'lim nomi bo'yicha qidiring..."
              emptyText="Bo'lim topilmadi"
              allText="Barchasi"
            />

            {/* Position Filter */}
            <SearchableSelect
              label="Pozitsiya"
              value={localFilters.positionId || ''}
              onChange={(value) => handleChange('positionId', value)}
              options={positions}
              placeholder="Pozitsiya nomi bo'yicha qidiring..."
              emptyText="Pozitsiya topilmadi"
              allText="Barchasi"
            />

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ko'nikmalar (vergul bilan ajrating)
              </label>
              <input
                type="text"
                value={localFilters.skills || ''}
                onChange={(e) => handleChange('skills', e.target.value)}
                placeholder="masalan: nodejs, mongodb"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Min Application Count */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Minimal arizalar soni
              </label>
              <input
                type="number"
                value={localFilters.minApplicationCount || ''}
                onChange={(e) => handleChange('minApplicationCount', e.target.value)}
                placeholder="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tartiblash
              </label>
              <select
                value={localFilters.sortBy || ''}
                onChange={(e) => handleChange('sortBy', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tartiblanmagan</option>
                <option value="applicationCount">Arizalar soni</option>
                <option value="createdAt">Yaratilgan sana</option>
                <option value="oylik">Maosh</option>
              </select>
            </div>

            {/* Sort Order */}
            {localFilters.sortBy && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tartib yo'nalishi
                </label>
                <select
                  value={localFilters.sortOrder || 'asc'}
                  onChange={(e) => handleChange('sortOrder', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="asc">O'sish bo'yicha</option>
                  <option value="desc">Kamayish bo'yicha</option>
                </select>
              </div>
            )}
          </div>

          {/* Reset Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
            >
              Filterni tozalash
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

