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
};
type GenericTextfieldProps<T extends FieldValues> = UseControllerProps<T> &
  InputFormProps;

const ICON_COMMON_CLASSES = (extra: string) =>
  "w-5 h-5 absolute top-[50%] translate-y-[-50%] pointer-events-none " + extra;
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
          <FormItem className="space-y-1">
            {label ? (
              <FormLabel className={cn("text-normal", labelClass)}>
                {label}
              </FormLabel>
            ) : null}
            <FormControl>
              <div className="relative ">
                {getIcon(leftIcon, ICON_COMMON_CLASSES("left-2"))}
                <Input
                  className={cn(rest.className, {
                    "pl-8": isIconExist(leftIcon),
                    "pr-8": isIconExist(rightIcon),
                  })}
                  // {...rest}
                  type={type}
                  placeholder={placeholder}
                  {...field}
                />
                {getIcon(rightIcon, ICON_COMMON_CLASSES("right-2"))}
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
