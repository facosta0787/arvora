import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document'
import styleSheet from 'styled-components/lib/models/StyleSheet'

export default class Arvora extends Document {

  static async getInitialProps ({ renderPage }) {
   const page = renderPage();
   const styles = (
    <style dangerouslySetInnerHTML={{ __html: styleSheet.rules().map(rule => rule.cssText).join('\n') }} />
   )
   return { ...page, styles }
  }

 render() {
  return (
   <html>
     <Head>
      <title>Arvora - Estrada Correa</title>
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      <link href="https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="/static/css/styleBase.css" rel="stylesheet" />
    </Head>
     <body>
       <Main />
       <NextScript />
     </body>
   </html>
  )
 }
}
