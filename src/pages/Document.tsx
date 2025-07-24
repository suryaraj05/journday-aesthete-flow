import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

const Document = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-800 dark:text-slate-100 mb-4">
            Requirements Engineering
          </h1>
          <h2 className="text-3xl font-semibold text-slate-600 dark:text-slate-300 mb-6">
            Identifying the Requirements from Problem Statements
          </h2>
          <Badge className="text-lg px-6 py-2">Technical Documentation</Badge>
        </div>

        {/* Objective Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Objective</h3>
            <ul className="list-disc pl-6 space-y-2 text-lg text-slate-700 dark:text-slate-300">
              <li>Identify ambiguities, inconsistencies and incompleteness from a requirements specification</li>
              <li>Identify and state functional requirements</li>
              <li>Identify and state non-functional requirements</li>
            </ul>
          </CardContent>
        </Card>

        {/* Requirements Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Requirements</h3>
            <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
              <p>• First step of any software development project.</p>
              <p>• Usually business analysts having domain knowledge on the subject matter discuss with clients and decide</p>
              <p>• <strong>"A specification of what should be implemented"</strong> - Sommerville</p>
              <p className="pl-6">○ specifies what to do, but not how to do</p>
              
              <div className="mt-6">
                <h4 className="text-xl font-semibold mb-3">Requirements Engineering</h4>
                <p className="pl-4">○ Refers to the process of understanding what a customer expects from the system to be developed</p>
                <p className="pl-4">○ To document them in a standard and easily readable and understandable format (Software Requirement Specification).</p>
                <p className="pl-4">○ This SRS documentation will serve as reference for the subsequent design, implementation and verification of the system.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Characteristics Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-purple-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Characteristics of Requirements</h3>
            <p className="text-lg mb-6 text-slate-700 dark:text-slate-300">
              Requirements gathered for any new system to be developed should exhibit the following three properties:
            </p>

            <div className="space-y-6">
              {/* Unambiguity */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">● Unambiguity:</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-3">○ There should not be any ambiguity what a system to be developed should do.</p>
                <div className="bg-white dark:bg-slate-800 p-4 rounded border-l-4 border-l-blue-400">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="text-sm">■ Consider you are developing a web application for your client. The client requires that enough number of people should be able to access the application simultaneously. What's the "enough number of people"? That could mean 10 to you, but, perhaps, 100 to the client. There's an ambiguity.</p>
                </div>
              </div>

              {/* Consistency */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-3">● Consistency:</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-3">○ The requirements in the document should not contradict each other</p>
                <p className="text-slate-700 dark:text-slate-300 mb-3">○ To illustrate this, consider the automation of a nuclear plant.</p>
                <div className="bg-white dark:bg-slate-800 p-4 rounded border-l-4 border-l-green-400">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="text-sm">■ Suppose one of the clients say that if the radiation level inside the plant exceeds R1, all reactors should be shut down. However, another person from the client side suggests that the threshold radiation level should be R2. Thus, there is an inconsistency between the two end users regarding what they consider as threshold level of radiation.</p>
                </div>
              </div>

              {/* Completeness */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-orange-800 dark:text-orange-200 mb-3">● Completeness:</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-3">○ A particular requirement for a system should specify what the system should do and also what it should not.</p>
                <div className="bg-white dark:bg-slate-800 p-4 rounded border-l-4 border-l-orange-400">
                  <p className="font-semibold mb-2">Example:</p>
                  <p className="text-sm">■ For example, consider a software to be developed for ATM. If a customer enters an amount greater than the maximum permissible withdrawal amount, the ATM should display an error message, and it should not dispense any cash.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categorization Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-indigo-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Categorization of Requirements</h3>
            
            <div className="mb-6">
              <h4 className="text-xl font-semibold mb-4">Based on the target audience or subject matter:</h4>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                  <h5 className="font-bold text-red-800 dark:text-red-200 mb-2">● High level: Business requirement</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300">○ Business view: Why is the project needed?</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <h5 className="font-bold text-yellow-800 dark:text-yellow-200 mb-2">● Mid level: User requirements</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300">○ User view: What do users need the system do?</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">○ Written for customer in natural language</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <h5 className="font-bold text-green-800 dark:text-green-200 mb-2">● Detailed: System requirements</h5>
                  <p className="text-sm text-slate-700 dark:text-slate-300">○ System view: What does the system need to do?</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300">○ Written for developers in more technical language</p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-lg">
              <h4 className="text-lg font-semibold mb-4">Example</h4>
              <div className="space-y-3">
                <div>
                  <span className="font-semibold text-red-600">● Business requirement:</span>
                  <p className="ml-4 text-sm">○ Requirement: "The company needs a mobile To-Do List application to increase customer engagement by providing a simple and effective way for users to organize their tasks and schedules."</p>
                </div>
                <div>
                  <span className="font-semibold text-yellow-600">● User requirements:</span>
                  <p className="ml-4 text-sm">○ Requirement 1: "Receive a reminder notification 10 minutes before a task is due so that user don't miss important tasks."</p>
                </div>
                <div>
                  <span className="font-semibold text-green-600">● System requirements:</span>
                  <p className="ml-4 text-sm">○ Requirement 1: "The system shall trigger a push notification to the user's device 10 minutes before the 'due_date' timestamp of any task marked as 'active'."</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Functional vs Non-Functional */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-cyan-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Categorization of Requirements</h3>
            <p className="text-lg mb-6 text-slate-700 dark:text-slate-300">
              Requirements can be classified into two groups based on what they describe:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">● Functional requirements (FRs):</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">○ Describe the functionality of a system</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm">○ How a system should react to a particular set of inputs and what should be the corresponding output.</p>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-xl font-semibold text-purple-800 dark:text-purple-200 mb-3">● Non-functional requirements (NFRs):</h4>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-3">○ Characteristics of a software system that are not related to specific functionality or behavior.</p>
                <p className="text-slate-700 dark:text-slate-300 text-sm mb-2">○ Broadly Three types:</p>
                <ul className="text-xs text-slate-600 dark:text-slate-400 ml-4 space-y-1">
                  <li>■ Product requirements: For example, a specification that mobile application must be compatible across all major mobile operating systems, including iOS</li>
                  <li>■ Performance requirements: For example, the system should remain available 24x7</li>
                  <li>■ Organizational requirements: For example, The development process should comply to SEI CMM level 4</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How to Identify Functional Requirements */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-teal-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">How to Identify Functional Requirements</h3>
            <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
              <div>
                <p>● <strong>From the conceptual understanding of the problem</strong></p>
                <p className="ml-6 text-sm italic">○ Example, Library Information System should be able to issue and return books.</p>
              </div>
              <div>
                <p>● <strong>Identify the cases where an end user gets some meaningful work done by using the system.</strong></p>
                <p className="ml-6 text-sm italic">○ Example, "Search Book" functionality is useful to obtain information about the books</p>
              </div>
              <div>
                <p>● <strong>Based on what inputs the system takes and what outputs the system return.</strong></p>
                <p className="ml-6 text-sm italic">○ Example, user gives title of the book as input, so we can identify the functionality 'Search for a Book by Author'</p>
              </div>
              <div>
                <p>● <strong>Also need to identify sub-requirements for high level requirements</strong></p>
                <p className="ml-6 text-sm italic">○ "Issue Book" module could behave differently for different class of users,</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SRS Section */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-pink-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Preparing Software Requirements Specifications (SRS)</h3>
            <div className="space-y-4 text-lg text-slate-700 dark:text-slate-300">
              <p>● Once all the functional and non-functional requirements have been identified, they are documented formally in SRS, which then serves as a legal agreement.</p>
              <p>● Requirements are usually written in text, may also be visuals, common formats and documents:</p>
              <ul className="ml-6 space-y-1 text-sm">
                <li>○ Software requirements specification document</li>
                <li>○ Use cases</li>
                <li>○ User stories</li>
                <li>○ Work Breakdown Structure (WBS) (functional decomposition)</li>
                <li>○ Prototypes</li>
                <li>○ Models and diagrams</li>
              </ul>
              <p>● We can use IEEE template for SRS</p>
              <p className="ml-6 text-sm text-blue-600 dark:text-blue-400">○ https://www.utdallas.edu/~chung/RE/Presentations06F/Team_1.doc</p>
            </div>
          </CardContent>
        </Card>

        {/* Case Study Header */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-rose-500">
          <CardContent className="p-8 bg-gradient-to-r from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20">
            <h3 className="text-3xl font-bold text-rose-800 dark:text-rose-200 mb-4 text-center">
              Case Study: A Library Information System
            </h3>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-inner">
              <h4 className="text-xl font-semibold mb-4 text-slate-800 dark:text-slate-100">Problem Statement</h4>
              <div className="text-slate-700 dark:text-slate-300 space-y-4 leading-relaxed">
                <p>The SE VLabs Institute has been recently setup to provide state-of-the-art research facilities in the field of Software Engineering. Apart from research scholars (students) and professors, it also includes quite a large number of employees who work on different projects undertaken by the institution.</p>
                
                <p>As the size and capacity of the institute is increasing with the time, it has been proposed to develop a Library Information System (LIS) for the benefit of students and employees of the institute. LIS will enable the members to borrow a book (or return it) with ease while sitting at his desk/chamber. The system also enables a member to extend the date of his borrowing if no other booking for that particular book has been made. For the library staff, this system aids them to easily handle day-to-day book transactions. The librarian, who has administrative privileges and complete control over the system, can enter a new record into the system when a new book has been purchased, or remove a record in case any book is taken off the shelf. Any non-member is free to use this system to browse/search books online. However, issuing or returning books is restricted to valid users (members) of LIS only.</p>
                
                <p>The final deliverable would a web application (using the recent HTML 5), which should run only within the institute LAN. Although this reduces security risk of the software to a large extent, care should be taken no confidential information (eg., passwords) is stored in plain text.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Functional Requirements */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-emerald-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Functional Requirements</h3>
            
            <div className="space-y-6">
              {/* New user registration */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-emerald-800 dark:text-emerald-200 mb-3">● New user registration:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ Any member of the institute has to register.</li>
                  <li>○ A user ID and password would be provided to the member.</li>
                  <li>○ He has to use this credentials for any future transaction in LIS.</li>
                </ul>
              </div>

              {/* Search book */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">● Search book:</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-2 ml-4">○ To check whether any particular book is present in the institute's library.</p>
                <p className="text-slate-700 dark:text-slate-300 ml-4">○ A book could be searched by its:</p>
                <ul className="ml-12 space-y-1 text-sm text-slate-600 dark:text-slate-400">
                  <li>■ Title</li>
                  <li>■ Authors name</li>
                  <li>■ Publisher's name</li>
                </ul>
              </div>

              {/* User login */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-3">● User login</h4>
                <div className="space-y-3 text-slate-700 dark:text-slate-300 ml-4">
                  <div>
                    <p>○ After successful login, "Home" page for the user is shown from where he can access the different functionalities.</p>
                    <p className="ml-6 text-sm">■ search book, issue book, return book, reissue book.</p>
                  </div>
                  <div>
                    <p>○ Unsuccessful login</p>
                    <p className="ml-6 text-sm">■ A login failure message would be shown to him, and the login dialog would appear again.</p>
                  </div>
                  <div>
                    <p>○ incorrect password has been provided for three time consecutively,</p>
                    <p className="ml-6 text-sm">■ the security question for the user (specified while registering) with an input box to answer it are also shown.</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Functional Requirements */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-amber-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Functional Requirements (Continued)</h3>
            
            <div className="space-y-6">
              {/* Issue book */}
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-3">● Issue book:</h4>
                <p className="text-slate-700 dark:text-slate-300 mb-3 ml-4">Any member of LIS can issue a book against his account provided that:</p>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-8">
                  <li>○ The book is available in the library i.e. could be found by searching for it in LIS</li>
                  <li>○ No other member has currently issued the book</li>
                  <li>○ Current user has not issued the maximum number of books that can</li>
                </ul>
                <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded mt-3 border-l-4 border-red-400">
                  <p className="text-sm text-red-800 dark:text-red-200">■ Note that this FR would remain incomplete if the "maximum number of books that can be issued to a member" is not defined.</p>
                </div>
              </div>

              {/* Return book */}
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">● Return book:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ A book is issued for a finite time, which we assume to be a period of 20 days.</li>
                  <li>○ After successful return of a book, the user account is updated to reflect the same.</li>
                </ul>
              </div>

              {/* Reissue book */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-indigo-800 dark:text-indigo-200 mb-3">● Reissue book:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ Any member who has issued a book might find that his requirement is not over by 20 days. In that case, he might choose to reissue the book, and get the permission to keep it for another 20 days.</li>
                  <li>○ A member can reissue any book at most twice, after which he has to return</li>
                  <li>○ Once a book has been successfully reissued, the user account is updated to reflect the information.</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Functional Requirements Priority */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-violet-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 text-center">Functional Requirements Priority</h3>
            <div className="bg-violet-50 dark:bg-violet-900/20 p-6 rounded-lg">
              <p className="text-center text-slate-600 dark:text-slate-400 italic">
                [Priority matrix or hierarchy would typically be displayed here]
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Non Functional Requirements */}
        <Card className="mb-8 shadow-lg border-l-4 border-l-red-500">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Non Functional Requirements</h3>
            
            <div className="space-y-6">
              {/* Performance Requirements */}
              <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">● Performance Requirements:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ This system should remain accessible 24x7</li>
                  <li>○ At least 50 users should be able to access the system altogether at any given time</li>
                </ul>
              </div>

              {/* Security Requirements */}
              <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-3">● Security Requirements:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ This system should be accessible only within the institute LAN</li>
                  <li>○ The database of LIS should not store any password in plain text -- a hashed value has to be stored</li>
                </ul>
              </div>

              {/* Other Requirements */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3">● Software Quality Attributes</h4>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">● Database Requirements</h4>
                </div>
              </div>

              {/* Design Constraints */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
                <h4 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-3">● Design Constraints:</h4>
                <ul className="space-y-2 text-slate-700 dark:text-slate-300 ml-4">
                  <li>○ The LIS has to be developed as a web application, which should work with Firefox 5, Internet Explorer 8, Google Chrome 12, Opera 10</li>
                  <li>○ The system should be developed using HTML 5</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-slate-500 dark:text-slate-400">
            © 2024 Requirements Engineering Documentation - Professional Technical Presentation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Document;
