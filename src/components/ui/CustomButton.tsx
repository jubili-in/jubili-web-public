import Image from "next/image";
import React, { ReactElement } from "react";

type Props = {
  onClick: () => void;
  loading: boolean;
  label: string;
  icon?: ReactElement;
  iconPosition?: 'left' | 'right';
  backgroundColor?: string;
  textColor?: string;
  disabled?: boolean;
};

export default function CustomButton({ 
  onClick, 
  loading, 
  label, 
  icon, 
  iconPosition = 'left',
  backgroundColor = '#262626',
  textColor = '#ffffff',
  disabled = false,
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "8px 16px",
        backgroundColor: backgroundColor,
        color: textColor,
        border: "none",
        borderRadius: "30px",
        cursor: loading ? "not-allowed" : "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        minWidth: "fit-content",
        transition: "all 0.2s ease",
      }}
    >
      {loading ? (
        <Image
          src="/icons/loading.svg" 
          alt="Loading" 
          style={{ 
            width: "20px", 
            height: "20px",
            filter: "brightness(0) invert(1)" // Makes the SVG white to match text color
          }} 
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
          )}
          {label}
          {icon && iconPosition === 'right' && (
            <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>
          )}
        </>
      )}
    </button>
  );
}
