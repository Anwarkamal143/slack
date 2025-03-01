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
import { cva, VariantProps } from "class-variance-authority";
const IInputVariants = cva(
  "border-transparent rounded-none border-solid border outline-none focus-visible:border-transparent px-0",
  {
    variants: {
      variant: {
        bottom:
          "border-b border-b-input hover:border-b-inputActive focus-visible:border-b-inputActive focus:border-b-inputActive",
        top: "border-t border-t-input hover:border-t-inputActive focus-visible:border-transparent focus-visible:border-t-inputActive  focus:border-t-inputActive",
        right:
          "border-r border-r-input hover:border-r-inputActive focus-visible:border-r-inputActive focus:border-r-inputActive",
        left: "border-l border-l-input hover:border-l-inputActive focus-visible:border-l-inputActive focus:border-l-inputActive",
      },
    },
    // defaultVariants: {
    //   variant: "none",
    // },
  }
);
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
  border?: VariantProps<typeof IInputVariants>["variant"];
};
type GenericTextfieldProps<T extends FieldValues> = UseControllerProps<T> &
  InputFormProps;

const ICON_COMMON_CLASSES = (extra: string) =>
  "h-[45%] absolute top-[50%]  translate-y-[-50%] pointer-events-none " + extra;
const FormInput = <T extends FieldValues>(
  props: GenericTextfieldProps<T>,
  ref: Ref<HTMLInputElement>
) => {
  const {
    name = "",
    id,
    label,
    defaultValue,
    disabled = false,
    helperText,
    rightIcon,
    leftIcon,
    placeholder,
    labelClass,
    type = "text",
    border,
    onChange,
    ...rest
  } = props;

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
    const pointerClasses = onClick
      ? " pointer-events-auto cursor-pointer "
      : "";
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
        className: cn(iconCommonClasses, pointerClasses, iconClasses),
        onClick: handleClick,
        ...iconMeta,
      });
    }
    if (Icon) {
      return cloneElement(Icon as any, {
        className: cn(iconCommonClasses, pointerClasses, iconClasses),
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
      // disabled={disabled}
      render={({ field }) => {
        console.log({ field });
        if (onChange) {
          field.onChange = onChange;
        }
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
                  disabled={disabled}
                  className={cn(
                    border &&
                      IInputVariants({
                        variant: border,
                      }),
                    rest.className,
                    {
                      "pl-8": isIconExist(leftIcon),
                      "pr-8": isIconExist(rightIcon),
                    }
                  )}
                  // {...rest}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  // onChange={onChange}
                />
              </div>
            </FormControl>
            <FormDescription className="!mt-0 ml-0.5">
              <FieldHelperText helperText={helperText} name={name} />
              <FieldError name={name} className="text-xs" />
            </FormDescription>
          </FormItem>
        );
      }}
    />
  );
};

export default forwardRef(FormInput);
