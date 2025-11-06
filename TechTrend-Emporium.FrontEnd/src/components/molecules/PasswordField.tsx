import { useState } from "react";
import { Input } from "../atoms";   // <-- antes era ../atoms/Input
import FormField from "./FormField";

export default function PasswordField({ label, value, onChange, placeholder }:{
  label: string; value: string; onChange: (v:string)=>void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  const press = (v:boolean)=>setShow(v);

  const Right = (
    <button
      type="button"
      className="text-xs text-gray-600 px-3 py-2"
      aria-label="Show password while pressed"
      onMouseDown={()=>press(true)} onMouseUp={()=>press(false)} onMouseLeave={()=>press(false)}
      onTouchStart={()=>press(true)} onTouchEnd={()=>press(false)}
    >
      Show
    </button>
  );

  return (
    <FormField label={label}>
      <Input
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={(e)=>onChange(e.target.value)}
        rightSlot={Right}
      />
    </FormField>
  );
}
