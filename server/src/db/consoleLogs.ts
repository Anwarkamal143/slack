const Style = {
  base: [
    "color: #fff",
    "background-color: #444",
    "padding: 2px 4px",
    "border-radius: 2px",
  ],
  info: ["color: #fff", "background-color: #44b0ff"],
  warning: ["color: #eee", "background-color: red"],
  success: ["background-color: green"],
};
export const cLog = (
  text: string | number,
  type: "error" | "success" | "info",
  extra = []
) => {
  let style = Style.base.join(";") + ";";
  style += extra.join(";"); // Add any additional styles
  if (type === "error") {
    style += Style.warning.join(";");
  }
  if (type === "info") {
    style += Style.info.join(";");
  }
  if (type === "success") {
    style += Style.success.join(";");
  }
  console.log(`%c${text}`, style);
};
