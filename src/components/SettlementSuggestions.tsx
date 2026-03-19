'use client';

import type { Settlement } from '@/types';

interface SettlementSuggestionsProps {
  settlements: Settlement[];
}

export default function SettlementSuggestions({ settlements }: SettlementSuggestionsProps) {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4">Settlement Suggestions</h2>

      {settlements.length === 0 ? (
        <div className="bg-green-100 border-2 border-green-400 rounded-lg p-6 text-center">
          <p className="text-lg font-semibold text-green-700">✓ Everyone is settled!</p>
          <p className="text-sm text-green-600 mt-1">All expenses are balanced</p>
        </div>
      ) : (
        <div className="space-y-3">
          {settlements.map((settlement, index) => (
            <div
              key={index}
              className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* From Person */}
                  <span className="font-semibold text-gray-800">
                    {settlement.names.from}
                  </span>

                  {/* Arrow */}
                  <span className="text-blue-600 font-bold">pays</span>

                  {/* To Person */}
                  <span className="font-semibold text-gray-800">
                    {settlement.names.to}
                  </span>
                </div>

                {/* Arrow Icon and Amount */}
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-2xl text-blue-500">→</span>
                  <span className="text-xl font-bold text-blue-700">
                    ${settlement.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
