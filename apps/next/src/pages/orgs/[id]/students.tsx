import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/organization-layout";
import { OrganizationStudents } from "../../../modules/organizations/pages/organization-students";
import { EmptyStudentsCard } from "../../../modules/organizations/empty-students-card";

const Page = () => {
  const isComingSoon = true; // Replace with your actual condition

  return (
    <>
      {isComingSoon ? <EmptyStudentsCard /> : <OrganizationStudents />}
    </>
  );
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
