"use client";

export function CheckoutSubmit({ children }: { children: React.ReactNode }) {
  return (
    <button
      className="button button-primary"
      type="submit"
      onClick={(event) => {
        event.currentTarget.form?.setAttribute("data-attempted", "true");
      }}
    >
      {children}
    </button>
  );
}
