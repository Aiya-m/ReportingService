import React, { useState } from 'react';

export const ACCOUNT_TYPES = {
  OFFICER: 'officer',
  LOCALPEOPLE: 'LOCALPEOPLE',
};

/**
 * RoleToggle Component
 * ปุ่มสลับสำหรับเลือกประเภทบัญชี (เจ้าหน้าที่ / ประชาชน)
 * @param {object} props
 * @param {function} props.onToggleChange - Callback ที่จะถูกเรียกเมื่อมีการเปลี่ยนค่า (ส่งค่า 'officer' หรือ 'LOCALPEOPLE' กลับไป)
 * @param {string} props.defaultType - ประเภทบัญชีเริ่มต้น (optional)
 */
const RoleToggle = ({ onToggleChange, defaultType = ACCOUNT_TYPES.LOCALPEOPLE }) => {
  const [accountType, setAccountType] = useState(defaultType);

  const handleToggle = (type) => {
    setAccountType(type);
    if (onToggleChange) {
      onToggleChange(type);
    }
  };

  const activeClasses = "bg-neutral-800 text-white shadow-lg";

  const inactiveClasses = "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300";

  return (
    <div className="flex justify-center items-center space-x-2 p-1 rounded-lg">
      <button
        type="button"
        onClick={() => handleToggle(ACCOUNT_TYPES.LOCALPEOPLE)}
        className={`
          py-3 px-6 rounded-lg font-semibold transition-all duration-200 ease-in-out
          ${accountType === ACCOUNT_TYPES.LOCALPEOPLE ? activeClasses : inactiveClasses}
        `}
      >
        บัญชีทั่วไป
      </button>
      <button
        type="button"
        onClick={() => handleToggle(ACCOUNT_TYPES.OFFICER)}
        className={`
          py-3 px-6 rounded-lg font-semibold transition-all duration-200 ease-in-out
          ${accountType === ACCOUNT_TYPES.OFFICER ? activeClasses : inactiveClasses}
        `}
      >
        บัญชีเจ้าหน้าที่
      </button>
    </div>
  );
};

export default RoleToggle;