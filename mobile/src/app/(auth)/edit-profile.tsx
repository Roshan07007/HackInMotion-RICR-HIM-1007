import React, { useState, useCallback } from "react";
import { View, TouchableOpacity } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { Txt } from "../../components/common/Typography";
import { router, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ImagePickerModal from "../../components/ui/inputs/ImagePickerModal";
import Avatar from "../../components/ui/data-display/Avatar";

import ScrollContainer from "../../components/ui/layout/ScrollContainer";
import Input from "../../components/ui/inputs/Input";
import Button from "../../components/ui/buttons/Button";
import ScreenHeader from "@/components/common/ScreenHeader";
import { toast } from "@/utils/toast";
import { authService } from "@/services/auth.service";
import * as DocumentPicker from "expo-document-picker";

export default function EditProfileScreen() {
  const { user, error, setUser, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => clearError();
    }, [clearError]),
  );

  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [github, setGithub] = useState(user?.github || "");
  const [linkedin, setLinkedin] = useState(user?.linkedin || "");
  const [website, setWebsite] = useState(user?.website || "");
  const [otherLink, setOtherLink] = useState(user?.otherLink || "");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [resumeUri, setResumeUri] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [isImagePickerOpen, setIsImagePickerOpen] = useState(false);

  const handlePickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      });
      if (result.canceled === false) {
        setResumeUri(result.assets[0].uri);
        setResumeName(result.assets[0].name);
      }
    } catch (err) {

    }
  };

  const handleSave = async () => {
    const formData = new FormData();
    try {
      setLoading(true);
      if (name !== user?.name) formData.append("name", name);
      if (phone !== user?.phone) formData.append("phone", phone);
      if (bio !== user?.bio) formData.append("bio", bio);
      if (github !== user?.github) formData.append("github", github);
      if (linkedin !== user?.linkedin) formData.append("linkedin", linkedin);
      if (website !== user?.website) formData.append("website", website);
      if (otherLink !== user?.otherLink) formData.append("otherLink", otherLink);

      if (avatarUri) {
        const filename = avatarUri.split("/").pop() || "avatar.jpg";
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;

        formData.append("avatar", {
          uri: avatarUri,
          name: filename,
          type,
        } as any);
      }

      if (resumeUri && resumeName) {
        const match = /\.(\w+)$/.exec(resumeName);
        const type = match ? `application/${match[1]}` : `application/pdf`;
        formData.append("resume", {
          uri: resumeUri,
          name: resumeName,
          type,
        } as any);
      }

      // Only update if something changed
      if (
        (formData as any).getParts &&
        (formData as any).getParts().length === 0
      ) {
        router.back();
        return;
      }

      const res = await authService.updateMe(formData);
      if (res.data.success) {
        setUser(res.data.data);
        toast.success("Profile updated successfully");
        router.back();
      } else {
        toast.error(res.data.message);
      }


    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScreenHeader title="Edit Profile" />
      <ScrollContainer
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
        }}
        className="bg-base-100"
      >
        <View className="items-center mb-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full items-center justify-center border-4 border-base-100 shadow shadow-base-content/20 overflow-hidden">
              {avatarUri ? (
                <Avatar url={avatarUri} size={104} />
              ) : (
                <Avatar
                  url={
                    user?.avatar?.url ||
                    `https://placehold.co/600x400?text=${user?.name?.charAt(0).toUpperCase() || "U"}`
                  }
                  size={104}
                />
              )}
            </View>
            <TouchableOpacity
              onPress={() => setIsImagePickerOpen(true)}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-base-100"
            >
              <Ionicons name="camera" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {error ? (
          <View className="bg-error/10 border border-error/20 rounded-2xl p-3 mb-4">
            <Txt variant="md" className="text-error text-xs text-center">
              ⚠️ {error}
            </Txt>
          </View>
        ) : null}

        <View className="gap-4">
          <Input
            leftIcon="person"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          <Input
            leftIcon="call"
            placeholder="Phone number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />

          <View className="mt-2">
            <Txt variant="sm" className="font-semibold text-base-content/60 uppercase tracking-wider mb-2 ml-1">
              About
            </Txt>
            <Input
              placeholder="Tell us about yourself..."
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={4}
              style={{ minHeight: 100, textAlignVertical: "top", paddingTop: 12 }}
            />
          </View>

          <View className="mt-2">
            <Txt variant="sm" className="font-semibold text-base-content/60 uppercase tracking-wider mb-2 ml-1">
              Social Links
            </Txt>
            <View className="gap-3">
              <Input
                leftIcon="logo-github"
                placeholder="GitHub Profile URL"
                value={github}
                onChangeText={setGithub}
                autoCapitalize="none"
              />
              <Input
                leftIcon="logo-linkedin"
                placeholder="LinkedIn Profile URL"
                value={linkedin}
                onChangeText={setLinkedin}
                autoCapitalize="none"
              />
              <Input
                leftIcon="globe-outline"
                placeholder="Personal Website URL"
                value={website}
                onChangeText={setWebsite}
                autoCapitalize="none"
              />
              <Input
                leftIcon="link"
                placeholder="Other Link URL"
                value={otherLink}
                onChangeText={setOtherLink}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View className="mt-2 mb-4">
            <Txt variant="sm" className="font-semibold text-base-content/60 uppercase tracking-wider mb-2 ml-1">
              Resume
            </Txt>
            <View className="flex-row items-center justify-between bg-base-200 border border-base-content/10 rounded-2xl p-4">
              <View className="flex-row items-center gap-3 flex-1 mr-4">
                <Ionicons name="document-text" size={24} color="#6366F1" />
                <Txt variant="base" className="font-medium" numberOfLines={1}>
                  {resumeName || (user?.resume?.url ? "Current Resume Uploaded" : "No resume uploaded")}
                </Txt>
              </View>
              <Button
                variant="outline"
                size="sm"
                label={resumeName || user?.resume?.url ? "Change" : "Upload"}
                onPress={handlePickResume}
              />
            </View>
          </View>

          <View className="mt-4">
            <Button
              label="Save Changes"
              onPress={handleSave}
              isLoading={loading}
              variant="primary"
              isFullWidth
            />
          </View>
        </View>
      </ScrollContainer>
      <ImagePickerModal
        isOpen={isImagePickerOpen}
        onClose={() => setIsImagePickerOpen(false)}
        onImageSelected={(image) => setAvatarUri(image.uri)}
        allowsEditing
        label="Profile Picture"
        subtitle="Choose a new profile picture"
      />
    </>
  );
}
