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

  // NEW PROPS
  horizontalPadding?: number; // px
  verticalPadding?: number;   // px
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

  // NEW DEFAULTS
  horizontalPadding = 16, // px
  verticalPadding = 8,    // px
}: Props) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: `${verticalPadding}px ${horizontalPadding}px`,
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
          width={20}
          height={20}
          src="/icons/loading.svg"
          alt="Loading"
          // style={{ 
          //   filter: "brightness(0) invert(1)"
          // }} 
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
