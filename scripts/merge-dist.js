import fs from "fs";
import path from "path";

const rootDist = path.resolve("dist");
const patientDist = path.resolve("frontend/Patient/dist");
const adminDist = path.resolve("frontend/Admin/dist");

// clean root dist
fs.rmSync(rootDist, { recursive: true, force: true });
fs.mkdirSync(rootDist, { recursive: true });

// copy patient dist to root
fs.cpSync(patientDist, rootDist, { recursive: true });

// copy admin dist to dist/admin
const adminOut = path.join(rootDist, "admin");
fs.mkdirSync(adminOut, { recursive: true });
fs.cpSync(adminDist, adminOut, { recursive: true });

console.log("✅ Build merged: Patient -> /dist , Admin -> /dist/admin");
