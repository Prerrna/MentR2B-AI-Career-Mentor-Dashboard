// import React from 'react'
// import Overview from './_components/overview'
// import { getMockInterviews } from '@/actions/mock-interview';

// const Aiinterviewpage = async () => {
  
//   const mockAssessments = await getMockInterviews();
//   return (
//     <div>
//         <Overview mockAssessments={mockAssessments} />
//     </div>
//   )
// }

// export default Aiinterviewpage
// import React from 'react';

// import Overview from './_components/overview';
// import { getMockInterviews } from '@/actions/mockInterview';

// const Aiinterviewpage = async () => {
//   // Fetch all mock interview assessments for the logged-in user
//   const mockAssessments = await getMockInterviews();

//   return (
//     <div>
//       <Overview mockAssessments={mockAssessments} />
//     </div>
//   );
// };

// export default Aiinterviewpage;



// import React from 'react';
// import Overview from './_components/overview';
// import { getMockInterviews } from '@/actions/mockInterview';

// const Aiinterviewpage = async () => {
//   const mockAssessments = await getMockInterviews();
//   return (
//     <div>
//       <Overview mockAssessments={mockAssessments} />
//     </div>
//   );
// };

// export default Aiinterviewpage;
// i

// import React from "react";
// import Overview from "./_components/overview";
// import { getMockInterviews } from "@/actions/mock-interview";

// const Aiinterviewpage = async () => {
//   // Fetch all mock interview data
//   const data = await getMockInterviews();

//   // Only send questions/answers if you actually have them
//   // If this is just the overview page, you likely don't need the POST here

//   return (
//     <div>
//       <Overview data={data} />
//     </div>
//   );
// };

import React from "react";
import Overview from "./_components/overview"; // make sure this path is correct!
import { getMockInterviews } from "@/actions/mock-interview";

const AiInterviewPage = async () => {
  let mockAssessments = [];
  try {
    mockAssessments = await getMockInterviews();
  } catch (error) {
    console.error("Failed to fetch mock interviews:", error);
  }

  return (
    <div>
      <h1>AI Mock Interviews</h1>
      <Overview mockAssessments={mockAssessments} />
    </div>
  );
};

export default AiInterviewPage;