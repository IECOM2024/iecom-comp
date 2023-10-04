import { BaseLayout, LayoutProps } from "./base-components/BaseLayout";

export const PublicLayout = ({ children, type }: LayoutProps) => (
    <BaseLayout type={type}>{children}</BaseLayout>
);
