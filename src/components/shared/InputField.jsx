const InputField = ({
    label,
    id,
    type,
    errors,
    register,
    required,
    message,
    className,
    min,
    max,
    pattern,
    patternMessage,
    value,
    placeholder,
    validate,
    step,
}) => {
    return (
        <div className="flex flex-col gap-1 w-full">
            <label
                htmlFor="id"
                className={`${
                    className ? className : ""
                } font-semibold text-sm text-slate-800`}>
                {label}
            </label>
            <input
                type={type}
                id={id}
                placeholder={placeholder}
                step={step}
                className={`${
                    className ? className : ""
                } px-2 py-2 border outline-none bg-transparent text-slate-800 rounded-md ${
                    errors[id]?.message ? "border-red-500" : "border-slate-700" 
                }`}
                {...register(id, {
                    required: { value: required, message },
                    minLength: min ? { value: min, message: `Minimum ${min} character is required` } : undefined,
                    maxLength: max ? { value: max, message: `Maximum ${max} character is allowed` } : undefined,
                    pattern: pattern
                        ? { value: pattern, message: patternMessage || "Invalid format" }
                        : type === "email"
                        ? {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Invalid email"
                          }
                        : type === "url"
                        ? {
                            value: /^(https?:\/\/)?(([a-zA-Z0-9\u00a1-\uffff-]+\.)+[a-zA-Z\u00a1-\uffff]{2,})(:\d{2,5})?(\/[^\s]*)?$/,
                            message: "Please enter a valid url"
                          }
                        : undefined,
                    validate,
                })}
                />

                {errors[id]?.message && (
                    <p className="text-sm font-semibold text-red-600 mt-0">
                        {errors[id]?.message}
                    </p>
                )}
        </div>
    );
};

export default InputField;