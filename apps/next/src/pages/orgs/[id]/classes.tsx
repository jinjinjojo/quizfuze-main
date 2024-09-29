import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationClasses } from "../../../modules/organizations/pages/organization-classes";
import { EmptyStudentsCard } from "../../../modules/organizations/empty-students-card";

const Page = () => {
  const isComingSoon = true; // Replace with your actual condition

  return (
    <>
      {isComingSoon ? <EmptyStudentsCard /> : <OrganizationClasses />}
    </>
  );
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
