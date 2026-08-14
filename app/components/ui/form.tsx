export const Input = ({ label, error, required, icon: Icon, ...props }: any) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[12px] font-semibold text-[#374151]">
        {label} {required && <span className="text-[#F97316]">*</span>}
      </label>
    )}
    <div className="relative">
      {Icon && (
        <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
      )}
      <input
        className={`w-full h-11 px-4 rounded-xl border-[1.5px] text-[14px] transition-all bg-white
          ${error ? 'border-red-300 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#F97316]'}
          ${Icon ? 'pl-10' : ''} outline-none placeholder:text-[#D1D5DB]`}
        {...props}
      />
    </div>
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);

export const TextArea = ({ label, error, required, ...props }: any) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[12px] font-semibold text-[#374151]">
        {label} {required && <span className="text-[#F97316]">*</span>}
      </label>
    )}
    <textarea
      className={`w-full px-4 py-3 rounded-xl border-[1.5px] text-[14px] transition-all bg-white resize-none
        ${error ? 'border-red-300 focus:border-red-500' : 'border-[#E5E7EB] focus:border-[#F97316]'}
        outline-none placeholder:text-[#D1D5DB]`}
      rows={5}
      {...props}
    />
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);

export const Select = ({ label, options, error, required, ...props }: any) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-[12px] font-semibold text-[#374151]">
        {label} {required && <span className="text-[#F97316]">*</span>}
      </label>
    )}
    <select
      className={`w-full h-11 px-4 rounded-xl border-[1.5px] text-[14px] transition-all bg-white
        ${error ? 'border-red-300' : 'border-[#E5E7EB] focus:border-[#F97316]'}
        outline-none appearance-none cursor-pointer`}
      {...props}
    >
      <option value="">Select...</option>
      {options.map((opt: any) => (
        <option key={opt.value || opt} value={opt.value || opt}>
          {opt.label || opt}
        </option>
      ))}
    </select>
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);