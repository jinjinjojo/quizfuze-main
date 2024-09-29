import { PageWrapper } from "../../../common/page-wrapper";
import { getLayout } from "../../../layouts/class-layout";
import { ClassHome } from "../../../modules/classes/pages/class-home";
import { EmptyStudentsCard } from "../../../modules/organizations/empty-students-card"; // Import the EmptyStudentsCard component

const Page = () => {
  const isComingSoon = true; // Replace with your actual condition

  return (
    <>
      {isComingSoon ? <EmptyStudentsCard /> : <ClassHome />}
    </>
  );
};

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;

export default Page;
