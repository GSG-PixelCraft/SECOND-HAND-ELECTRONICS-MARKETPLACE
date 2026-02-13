import type { Meta, StoryObj } from "@storybook/react";
import {
  VerificationTableHeader,
  VerificationTableRow,
  CountryManagementTableHeader,
  CountryManagementTableRow,
} from "../index";

const meta = {
  title: "Components/Admin/UI/Table/SpecializedTables",
  tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj;

export const VerificationTable: Story = {
  render: () => (
    <div className="overflow-hidden rounded-lg border border-neutral-20">
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
            onView={() => console.log("View John")}
          />
        </tbody>
      </table>
    </div>
  ),
};

export const CountryTable: Story = {
  render: () => (
    <div className="overflow-hidden rounded-lg border border-neutral-20">
      <table className="w-full">
        <thead>
          <CountryManagementTableHeader />
        </thead>
        <tbody>
          <CountryManagementTableRow
            countryCode="US"
            countryName="United States"
            flag="US"
            isEnabled={true}
          />
        </tbody>
      </table>
    </div>
  ),
};
