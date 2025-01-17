"use client";
import {
  FieldValues,
  UseControllerProps,
  useFormContext,
} from "react-hook-form";

import { cloneElement, forwardRef, MouseEvent, ReactNode, Ref } from "react";
import FieldError from "./FieldError";
import FieldHelperText from "./FieldHelperText";
// import TwInput, { IInputProps } from "./TwInput";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input, InputProps } from "@/components/ui/input";
import { cn } from "@/lib/utils";
type IConRenderProps = {
  className?: string;
  onClick: (e: MouseEvent | TouchEvent) => void;
};
type ICommon = {
  className?: string;
  onClick?: (
    e: MouseEvent | TouchEvent,
    { value, name }: { value: any; name: string }
  ) => void;
  meta?: Record<string, any>;
};
type IconProps = ICommon &
  (
    | {
        render: (props: IConRenderProps) => ReactNode;
        Icon?: never;
      }
    | {
        render?: never;
        Icon: ReactNode;
      }
  );
type InputFormProps = InputProps & {
  label?: ReactNode;
  labelClass?: string;
  helperText?: ReactNode;
  leftIcon?: IconProps;
  rightIcon?: IconProps;
  border?: "b" | "t" | "l" | "r";
};
type GenericTextfieldProps<T extends FieldValues> = UseControllerProps<T> &
  InputFormProps;

const ICON_COMMON_CLASSES = (extra: string) =>
  "h-[45%] absolute top-[50%]  translate-y-[-50%] pointer-events-none " + extra;
const borderClasses = {
  b: "border-transparent rounded-none border-solid border outline-none  border-b border-b-input hover:border-b-gray-300 focus-visible:border-b-gray-400 focus:border-b-gray-400 !ring-0 !ring-offset-0",
  t: "border-transparent rounded-none border-solid border outline-none  border-t border-t-input hover:border-t-gray-300 focus-visible:border-t-gray-400 focus:border-t-gray-400 !ring-0 !ring-offset-0",
  r: "border-transparent rounded-none border-solid border outline-none  border-r border-r-input hover:border-r-gray-300 focus-visible:border-r-gray-400 focus:border-r-gray-400 !ring-0 !ring-offset-0",
  l: "border-transparent rounded-none border-solid border outline-none  border-l border-l-input hover:border-l-gray-300 focus-visible:border-l-gray-400 focus:border-l-gray-400 !ring-0 !ring-offset-0",
} as const;
const FormInput = <T extends FieldValues>(
  props: GenericTextfieldProps<T>,
  ref: Ref<HTMLInputElement>
) => {
  const {
    name = "",
    id,
    label,
    defaultValue,
    disabled,
    helperText,
    rightIcon,
    leftIcon,
    placeholder,
    labelClass,
    type = "text",
    border,
    ...rest
  } = props;
  const borderClass = border ? borderClasses[border] : "";
  const { control, getValues } = useFormContext();

  const isIconExist = (Icon?: IconProps) => {
    if (!Icon || (!Icon.Icon && !Icon.render)) {
      return false;
    }
    return true;
  };

  const getIcon = (iconSettings?: IconProps, iconCommonClasses?: string) => {
    const {
      render,
      Icon,
      meta: iconMeta,
      onClick,
      className: iconClasses,
    } = iconSettings || {};
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (onClick) {
        onClick(event, { value: getValues(name), name });
      }
    };
    if (render) {
      // return cloneElement(
      //   render({
      //     className: cn(iconClasses),
      //     onClick: handleClick,
      //     ...iconMeta,
      //   }) as any,
      //   {
      //     className: cn(iconCommonClasses, iconClasses),
      //   }
      // );
      return render({
        className: cn(iconCommonClasses, iconClasses),
        onClick: handleClick,
        ...iconMeta,
      });
    }
    if (Icon) {
      return cloneElement(Icon as any, {
        className: cn(iconCommonClasses, iconClasses),
        onClick: handleClick,
        ...iconMeta,
      });
    }
    return null;
  };
  return (
    <FormField
      defaultValue={defaultValue}
      control={control}
      name={name}
      disabled={!!disabled}
      render={({ field }) => {
        return (
          <FormItem className="space-y-1 ">
            {label ? (
              <FormLabel className={cn("text-normal", labelClass)}>
                {label}
              </FormLabel>
            ) : null}
            <FormControl>
              <div className="relative ">
                {getIcon(leftIcon, ICON_COMMON_CLASSES("left-2"))}
                {getIcon(rightIcon, ICON_COMMON_CLASSES("right-2"))}
                <Input
                  className={cn(borderClass, rest.className, {
                    "pl-8": isIconExist(leftIcon),
                    "pr-8": isIconExist(rightIcon),
                  })}
                  // {...rest}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                />
              </div>
            </FormControl>
            <FormDescription>
              <FieldHelperText helperText={helperText} name={name} />
              <FieldError name={name} />
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

export default forwardRef(FormInput);
