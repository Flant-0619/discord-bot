import {  VercelRequest, VercelResponse } from "@vercel/node";

export default function (req:  VercelRequest, res: VercelResponse) {
  console.log(req)
  console.log(res)
  console.log('hoge')
}