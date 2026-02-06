import type { Meta, StoryObj } from "@storybook/react";
import {
    VerificationTableHeader,
    VerificationTableRow,
    CountryManagementTableHeader,
    CountryManagementTableRow,
} from "../index";

const meta = {
    title: "Admin/UI/Table/SpecializedTables",
    tags: ["autodocs"],
} satisfies Meta;

export default meta;

export const VerificationTable: StoryObj = {
    render: () => (
        <div className="rounded-lg border border-neutral-20 overflow-hidden">
            <table className="w-full">
                <thead>
                    <VerificationTableHeader />
                </thead>
                <tbody>
                    <VerificationTableRow
                        userId="USR-001"
                        userName="John Doe"
                        userAvatar="https://i.pravatar.cc/150?img=1"
                        verificationType="Government ID"
                        submittedDate="2024-02-05"
                        status="pending"
                        onView={() => alert("View John")}
                    />
                    <VerificationTableRow
                        userId="USR-002"
                        userName="Jane Smith"
                        userAvatar="https://i.pravatar.cc/150?img=2"
                        verificationType="Passport"
                        submittedDate="2024-02-04"
                        status="under-review"
                    />
                    <VerificationTableRow
                        userId="USR-003"
                        userName="Mike Ross"
                        verificationType="Driver License"
                        submittedDate="2024-02-01"
                        status="verified"
                    />
                </tbody>
            </table>
        </div>
    ),
};

export const CountryTable: StoryObj = {
    render: () => (
        <div className="rounded-lg border border-neutral-20 overflow-hidden">
            <table className="w-full">
                <thead>
                    <CountryManagementTableHeader />
                </thead>
                <tbody>
                    <CountryManagementTableRow
                        countryCode="US"
                        countryName="United States"
                        flag="🇺🇸"
                        isEnabled={true}
                    />
                    <CountryManagementTableRow
                        countryCode="GB"
                        countryName="United Kingdom"
                        flag="🇬🇧"
                        isEnabled={false}
                    />
                </tbody>
            </table>
        </div>
    ),
};
