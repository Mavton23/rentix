import React, { useState, useEffect } from "react";
import { countryCodes } from "../../utils/countryCodes";
import { Input } from "./input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./select";
import { Label } from "./label";

const PhoneInput = React.forwardRef(({ 
  value = "", 
  onChange, 
  id, 
  label, 
  placeholder = "Número de telefone",
  className,
  required = false,
  disabled = false
}, ref) => {
  const [selectedCode, setSelectedCode] = useState(countryCodes[0]);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    if (value) {
      const foundCode = countryCodes.find(code => 
        value.startsWith(code.code)
      ) || countryCodes[0];
      
      setSelectedCode(foundCode);
      setPhoneNumber(value.replace(foundCode.code, ''));
    }
  }, [value]);

  const handlePhoneChange = (e) => {
    const number = e.target.value.replace(/\D/g, '');
    setPhoneNumber(number);
    onChange?.(`${selectedCode.code}${number}`);
  };

  const handleCodeChange = (code) => {
    const newCode = countryCodes.find(c => c.code === code);
    setSelectedCode(newCode);
    onChange?.(`${newCode.code}${phoneNumber}`);
  };

  return (
    <div className={`space-y-2 dark:text-gray-300 ${className}`}>
      {label && <Label htmlFor={id}>{label}{required && <span className="text-red-500">*</span>}</Label>}
      <div className="flex gap-2">
        <Select 
          value={selectedCode.code} 
          onValueChange={handleCodeChange}
          disabled={disabled}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue>
              {selectedCode.flag} {selectedCode.code}
            </SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600/25 rounded-md shadow-lg">
            {countryCodes.map((country) => (
              <SelectItem key={country.code} value={country.code} className="hover:bg-gray-100 dark:hover:bg-gray-500/15">
                {country.flag} {country.name} ({country.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Input
          ref={ref}
          type="tel"
          id={id}
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          className="flex-1"
          required={required}
          disabled={disabled}
        />
      </div>
      <p className="text-xs text-gray-500">
        Formato: {selectedCode.code} {placeholder}
      </p>
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";

export { PhoneInput };