// Verification Table Components
import * as React from "react";
import { cn } from "@/lib/utils";
import { Text } from "@/components/ui/text";

export type VerificationTableHeaderProps = React.HTMLAttributes<HTMLTableRowElement>;

export const VerificationTableHeader = React.forwardRef<HTMLTableRowElement, VerificationTableHeaderProps>(
    ({ className, ...props }, ref) => {
        const columns = [
            { key: "user", label: "User", width: "25%" },
            { key: "type", label: "Type", width: "15%" },
            { key: "submitted", label: "Submitted", width: "15%" },
            { key: "status", label: "Status", width: "15%", align: "center" },
            { key: "actions", label: "Actions", width: "20%", align: "right" },
        ];

        return (
            <tr
                ref={ref}
                className={cn("bg-[rgba(37,99,235,0.1)] border-b border-primary/20", className)}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            !column.align && "text-left",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

VerificationTableHeader.displayName = "VerificationTableHeader";

// Country Management Table Header
export type CountryManagementTableHeaderProps = React.HTMLAttributes<HTMLTableRowElement>;

export const CountryManagementTableHeader = React.forwardRef<HTMLTableRowElement, CountryManagementTableHeaderProps>(
    ({ className, ...props }, ref) => {
        const columns = [
            { key: "flag", label: "Flag", width: "10%" },
            { key: "name", label: "Country Name", width: "30%" },
            { key: "code", label: "Code", width: "15%" },
            { key: "status", label: "Status", width: "20%", align: "center" },
            { key: "actions", label: "Actions", width: "25%", align: "right" },
        ];

        return (
            <tr
                ref={ref}
                className={cn("bg-[rgba(37,99,235,0.1)] border-b border-primary/20", className)}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            !column.align && "text-left",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

CountryManagementTableHeader.displayName = "CountryManagementTableHeader";

// Currency Management Table Header
export type CurrencyManagementTableHeaderProps = React.HTMLAttributes<HTMLTableRowElement>;

export const CurrencyManagementTableHeader = React.forwardRef<HTMLTableRowElement, CurrencyManagementTableHeaderProps>(
    ({ className, ...props }, ref) => {
        const columns = [
            { key: "symbol", label: "Symbol", width: "10%" },
            { key: "name", label: "Currency Name", width: "30%" },
            { key: "code", label: "Code", width: "15%" },
            { key: "status", label: "Status", width: "20%", align: "center" },
            { key: "actions", label: "Actions", width: "25%", align: "right" },
        ];

        return (
            <tr
                ref={ref}
                className={cn("bg-[rgba(37,99,235,0.1)] border-b border-primary/20", className)}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            !column.align && "text-left",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

CurrencyManagementTableHeader.displayName = "CurrencyManagementTableHeader";

// User Management Table Header
export type UserManagementHeaderProps = React.HTMLAttributes<HTMLTableRowElement>;

export const UserManagementHeader = React.forwardRef<HTMLTableRowElement, UserManagementHeaderProps>(
    ({ className, ...props }, ref) => {
        const columns = [
            { key: "user", label: "User", width: "30%" },
            { key: "email", label: "Email", width: "25%" },
            { key: "role", label: "Role", width: "15%" },
            { key: "status", label: "Status", width: "15%", align: "center" },
            { key: "actions", label: "Actions", width: "15%", align: "right" },
        ];

        return (
            <tr
                ref={ref}
                className={cn("bg-[rgba(37,99,235,0.1)] border-b border-primary/20", className)}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            !column.align && "text-left",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

UserManagementHeader.displayName = "UserManagementHeader";

// Categories Table Header
export type CategoriesTableHeaderProps = React.HTMLAttributes<HTMLTableRowElement>;

export const CategoriesTableHeader = React.forwardRef<HTMLTableRowElement, CategoriesTableHeaderProps>(
    ({ className, ...props }, ref) => {
        const columns = [
            { key: "icon", label: "Icon", width: "10%" },
            { key: "name", label: "Category Name", width: "35%" },
            { key: "subcategories", label: "Subcategories", width: "20%", align: "center" },
            { key: "listings", label: "Listings", width: "15%", align: "center" },
            { key: "actions", label: "Actions", width: "20%", align: "right" },
        ];

        return (
            <tr
                ref={ref}
                className={cn("bg-[rgba(37,99,235,0.1)] border-b border-primary/20", className)}
                {...props}
            >
                {columns.map((column) => (
                    <th
                        key={column.key}
                        className={cn(
                            "px-6 py-4",
                            column.align === "center" && "text-center",
                            column.align === "right" && "text-right",
                            !column.align && "text-left",
                        )}
                        style={{ width: column.width }}
                    >
                        <Text variant="body" className="font-semibold text-primary uppercase tracking-wide text-sm">
                            {column.label}
                        </Text>
                    </th>
                ))}
            </tr>
        );
    },
);

CategoriesTableHeader.displayName = "CategoriesTableHeader";
