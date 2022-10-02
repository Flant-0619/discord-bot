import {  VercelRequest, VercelResponse } from "@vercel/node";

export default function handler(req:  VercelRequest, res: VercelResponse) {
  console.log(req)
  console.log(res)
  console.log('hoge')
  res.end()
}