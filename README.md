#PayPal Opportunity Hack 2017
###Team 18 submission
####Non-profit Organization: Arziona Council of Economic Education

##Inspiration

When we heard about the case about  Elena Zee at ACEE, we thought the problem faced by her and her team could be solved and deserved an upgrade. The high impact of developing a solution would not only save time but increase data reliability going forward and the reporting would be appealing to potential donors. This moved us to go forward with the work.

##What it does

Our solution drastically improves the presentation of data which was previously done manually in excel with tedious manual labor.  With our solution, the customer will replace a plethora of work hours with our simple click and go design.  Now we present the registered teachers informations sourced from constantcontact.com via an API GET request to gather details such as number of Highly qualified teachers and number of schools which provide reduced priced lunch.  In addition, we also included the yearly teacher’s registration growth rate and the growth rate of schools participating in the program; plus many other logistic computations at a click of a button.  It does not stop there, the user have the ability compare previous metrics to see the yearly performance of the organization.

##How we built it

By leveraging the build in database of constantcontacts.com, we fetch the list of registered teachers via an API REST request statically to reduce the maintenance cost of having a newly build backend.  For our visual presentation, we use ChartJS for our graphs and AngularJS for our javascript framework.  Additionally we utilize the Bootstrap library for other components.  Our system is simple, with a small file size due to the technology of CDN import.  Thus, will not take up much storage space or have a dedicated machine for the application to run.  

##Challenges we ran into

Getting contact details from constantcontact.com was a big challenge since the data was spread across many spreadsheets and inconsistent.  

##Accomplishments that I’m proud of

We are able to deliver an application that is capable of reporting the data precisely and immensely fast delivery (approximately less than 1 seconds).  

##What I learned

Though it was easier for us to setup the new registration process through application we had to stick to the clients requirement, due to the constraint of wifi availability at the time of registration at the workshops, hence we let the client continue to leverage constantcontact.com to be the place to store the data and use our application for reporting.