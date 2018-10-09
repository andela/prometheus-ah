const emailTemplate = {
  verficationEmail: url => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Authors Haven Email Template</title>
    <style>
      .containerOuter{
       box-sizing: border-box;
       font-family: 'Open Sans','Helvetica Neue','Helvetica',Helvetica,Arial,sans-serif;
       padding: 30px;
       max-width: 600px;
       text-align: center;
       margin: auto;
      }
      .appName {
       color: #C0392B;
      }
      .container {
       box-sizing: border-box;
       font-size: 16px;
       vertical-align: top;
       padding: 30px;
       background-color: whitesmoke;
      }
      .text {
       color: #000000;
       font-size: 15px;
       line-height: 26px;
       margin: 0;
       text-align: center;
      }
      .button {
       box-sizing: border-box;
       border-color: #348eda;
       font-weight: 400;
       text-decoration: none;
       display: inline-block;
       color: #ffffff !important;
       background-color: #C0392B;
       border-radius: 2px;
       font-size: 16px;
       padding: 15px 25px;
       display: inline-block;
       margin-top: 10px;
       margin-bottom: 10px;
      }
      h3 {
        color: #000 !important;
      }
     .ii a[href] {
       color: #fff;
     }
     .hx {
      color: #500050;
    }
    </style>
  </head>
  <body>
    <div class="containerOuter">
     <section>
      <h1 class="appName">Authors Haven</h1>
     </section>
     <section class="container">
      <header class="header">
        <h3>Welcome to Authors Haven!</h3>
        <h3>Click the Button below to confirm your email address on Authors Haven</h3>
      </header>
      <p>Let's confirm your email address.<p>
      <a class="button" href="${url}">Confirm Email Address</a>
    </section>
    </div>
   </body>
  </html>
  `
};

export default emailTemplate;
