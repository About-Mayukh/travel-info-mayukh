import React, { forwardRef } from 'react';

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    trailingIcon: TrailingIcon,
    onTrailingIconClick,
    className = '',
    type = 'text',
    required = false,
    ...props
  },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative rounded-xl shadow-sm">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          required={required}
          className={`
            w-full rounded-xl border bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500
            transition-all duration-200 text-sm
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${TrailingIcon ? 'pr-10' : 'pr-3.5'}
            py-2.5
            ${
              error
                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500/20'
            }
            focus:outline-none focus:ring-4
            ${className}
          `}
          {...props}
        />
        {TrailingIcon && (
          <div
            onClick={onTrailingIconClick}
            className={`absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ${
              onTrailingIconClick ? 'cursor-pointer' : 'pointer-events-none'
            }`}
          >
            <TrailingIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500 font-medium">{error}</p>}
      {helperText && !error && (
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      )}
    </div>
  );
});

export default Input;
