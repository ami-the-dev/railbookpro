import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserById, updateUser, updateUserPassword } from "@/lib/auth-store";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = findUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      maritalStatus: user.maritalStatus,
      nationality: user.nationality,
      occupation: user.occupation,
      address: user.address,
      city: user.city,
      state: user.state,
      pincode: user.pincode,
      country: user.country,
      idType: user.idType,
      idNumber: user.idNumber,
      securityQuestion: user.securityQuestion,
      securityAnswer: user.securityAnswer,
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = findUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { currentPassword, newPassword, ...profileData } = body;

    if (Object.keys(profileData).length === 0 && !newPassword) {
      return NextResponse.json({ message: "Nothing to update" }, { status: 400 });
    }

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ message: "Current password is required to set a new password" }, { status: 400 });
      }
      if (user.password !== currentPassword) {
        return NextResponse.json({ message: "Current password is incorrect" }, { status: 403 });
      }
      updateUserPassword(user.id, newPassword);
    }

    if (Object.keys(profileData).length > 0) {
      updateUser(user.id, profileData);
    }

    const updated = findUserById(user.id)!;
    return NextResponse.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      role: updated.role,
      dateOfBirth: updated.dateOfBirth,
      gender: updated.gender,
      maritalStatus: updated.maritalStatus,
      nationality: updated.nationality,
      occupation: updated.occupation,
      address: updated.address,
      city: updated.city,
      state: updated.state,
      pincode: updated.pincode,
      country: updated.country,
      idType: updated.idType,
      idNumber: updated.idNumber,
      securityQuestion: updated.securityQuestion,
      securityAnswer: updated.securityAnswer,
    });
  } catch {
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
