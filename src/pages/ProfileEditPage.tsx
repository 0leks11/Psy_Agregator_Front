import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getSkills,
  getLanguages,
  updateBaseProfile,
  updateProfilePicture,
  updateTherapistProfile,
  updateClientProfile,
} from "../services/profileService";
import {
  SkillData,
  LanguageData,
  FullUserData,
  GENDER_OPTIONS,
  UserProfileData,
} from "../types/user";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// Вспомогательная функция для извлечения ID из массива объектов/чисел
const getIds = (items: { id: number }[] | undefined): number[] =>
  items ? items.map((item) => item.id) : [];

const ProfileEditPage: React.FC = () => {
  const { user, updateUserState } = useAuth();
  const navigate = useNavigate();

  // --- Состояния ---
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] =
    useState<UserProfileData["gender_code"]>("UNKNOWN");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  // Для терапевтов
  const [about, setAbout] = useState("");
  const [experienceYears, setExperienceYears] = useState<number | "">(0);
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [totalHours, setTotalHours] = useState<number | "">("");
  const [displayHours, setDisplayHours] = useState(false);
  const [officeLocation, setOfficeLocation] = useState("");

  // Для клиентов
  const [requestDetails, setRequestDetails] = useState("");
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

  // Данные для выбора
  const [availableSkills, setAvailableSkills] = useState<SkillData[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<LanguageData[]>(
    []
  );

  // Состояния UI
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Эффекты ---

  // Загрузка доступных навыков и языков при монтировании
  useEffect(() => {
    const loadChoices = async () => {
      setLoadingData(true);
      try {
        const [skillsData, languagesData] = await Promise.all([
          getSkills(),
          getLanguages(),
        ]);
        setAvailableSkills(skillsData);
        setAvailableLanguages(languagesData);
      } catch (err) {
        setError(
          "Не удалось загрузить опции профиля (навыки/языки). Пожалуйста, обновите страницу."
        );
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    };
    loadChoices();
  }, []);

  // Заполнение формы данными пользователя
  useEffect(() => {
    const typedUser = user as FullUserData | null;
    if (typedUser && !loadingData) {
      setFirstName(typedUser.first_name || "");
      setLastName(typedUser.last_name || "");
      setGender(typedUser.profile?.gender_code || "UNKNOWN");
      setPicturePreview(typedUser.profile?.profile_picture_url || null);

      if (
        typedUser.profile?.role === "THERAPIST" &&
        typedUser.therapist_profile
      ) {
        setAbout(typedUser.therapist_profile.about || "");
        setExperienceYears(typedUser.therapist_profile.experience_years ?? "");
        setSelectedSkillIds(getIds(typedUser.therapist_profile.skills));
        setSelectedLanguageIds(getIds(typedUser.therapist_profile.languages));
        setTotalHours(typedUser.therapist_profile.total_hours_worked ?? "");
        setDisplayHours(typedUser.therapist_profile.display_hours || false);
        setOfficeLocation(typedUser.therapist_profile.office_location || "");
      } else if (
        typedUser.profile?.role === "CLIENT" &&
        typedUser.client_profile
      ) {
        setRequestDetails(typedUser.client_profile.request_details || "");
        setSelectedTopicIds(getIds(typedUser.client_profile.interested_topics));
      }
    }
  }, [user, loadingData]);

  // --- Обработчики ---
  const handlePictureChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла изображения не должен превышать 5MB.");
        return;
      }
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  };

  const handleCheckboxChange = (
    e: ChangeEvent<HTMLInputElement>,
    currentSelection: number[],
    setter: React.Dispatch<React.SetStateAction<number[]>>
  ) => {
    const { value, checked } = e.target;
    const id = parseInt(value, 10);
    if (checked) {
      setter([...currentSelection, id]);
    } else {
      setter(currentSelection.filter((itemId) => itemId !== id));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    const typedUser = user as FullUserData | null;

    if (!typedUser) {
      setError("Данные пользователя недоступны.");
      setSaving(false);
      return;
    }

    try {
      const promises: Promise<FullUserData>[] = [];

      // 1. Обновление базового профиля
      promises.push(
        updateBaseProfile({
          first_name: firstName,
          last_name: lastName,
          gender: gender,
        })
      );

      // 2. Обновление фотографии
      if (profilePicture) {
        const pictureFormData = new FormData();
        pictureFormData.append("profile_picture", profilePicture);
        promises.push(updateProfilePicture(pictureFormData));
      }

      // 3. Обновление профиля в зависимости от роли
      if (typedUser.profile?.role === "THERAPIST") {
        promises.push(
          updateTherapistProfile({
            about: about,
            experience_years: Number(experienceYears) || 0,
            skills: selectedSkillIds,
            languages: selectedLanguageIds,
            total_hours_worked: totalHours === "" ? null : Number(totalHours),
            display_hours: displayHours,
            office_location: officeLocation,
          })
        );
      } else if (typedUser.profile?.role === "CLIENT") {
        promises.push(
          updateClientProfile({
            request_details: requestDetails,
            interested_topics: selectedTopicIds,
          })
        );
      }

      const results = await Promise.all(promises);
      const finalUserData = results[results.length - 1];

      if (finalUserData) {
        updateUserState(finalUserData);
      }

      alert("Профиль успешно обновлен!");
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Ошибка обновления профиля:", err);
      let backendError =
        "Не удалось обновить профиль. Пожалуйста, проверьте введенные данные и попробуйте снова.";
      if (err.response && err.response.data) {
        const data = err.response.data;
        if (typeof data === "object") {
          backendError = Object.entries(data)
            .map(
              ([field, messages]) =>
                `${field}: ${
                  Array.isArray(messages) ? messages.join(" ") : messages
                }`
            )
            .join("\n");
        } else if (typeof data === "string") {
          backendError = data;
        }
      } else if (err.message) {
        backendError = err.message;
      }
      setError(backendError);
    } finally {
      setSaving(false);
    }
  };

  // --- Рендеринг ---
  if (loadingData && !user) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <ErrorMessage message="Для редактирования профиля необходимо войти в систему." />
    );
  }

  const typedUser = user as FullUserData;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Редактирование профиля
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6 md:p-8 space-y-6"
      >
        {error && <ErrorMessage message={error} />}

        {/* Основная информация */}
        <fieldset className="border p-4 rounded-md">
          <legend className="text-lg font-semibold px-2 text-gray-700">
            Основная информация
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Имя
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Пол
              </label>
              <select
                id="gender"
                value={gender}
                onChange={(e) =>
                  setGender(e.target.value as UserProfileData["gender_code"])
                }
                disabled={saving}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {GENDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Фотография профиля
              </label>
              <div className="flex items-center space-x-4">
                {picturePreview && (
                  <img
                    src={picturePreview}
                    alt="Предпросмотр"
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                )}
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handlePictureChange}
                  disabled={saving}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Профиль терапевта */}
        {typedUser.profile?.role === "THERAPIST" && (
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Информация о специалисте
            </legend>
            <div className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  О себе
                </label>
                <textarea
                  id="about"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  rows={5}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="experienceYears"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Опыт работы (лет)
                  </label>
                  <input
                    type="number"
                    id="experienceYears"
                    value={experienceYears}
                    onChange={(e) =>
                      setExperienceYears(
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10)
                      )
                    }
                    min="0"
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="officeLocation"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Местоположение / Формат работы
                  </label>
                  <input
                    type="text"
                    id="officeLocation"
                    value={officeLocation}
                    onChange={(e) => setOfficeLocation(e.target.value)}
                    placeholder="Например: Онлайн, Москва"
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="totalHours"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Общее количество часов практики (опционально)
                  </label>
                  <input
                    type="number"
                    id="totalHours"
                    value={totalHours}
                    onChange={(e) =>
                      setTotalHours(
                        e.target.value === ""
                          ? ""
                          : parseInt(e.target.value, 10)
                      )
                    }
                    min="0"
                    disabled={saving}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <input
                    type="checkbox"
                    id="displayHours"
                    checked={displayHours}
                    onChange={(e) => setDisplayHours(e.target.checked)}
                    disabled={saving}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="displayHours"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Показывать часы в профиле
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Навыки и специализация
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.length === 0 && (
                    <span className="text-sm text-gray-500 col-span-full">
                      Загрузка навыков...
                    </span>
                  )}
                  {availableSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill.id}`}
                        value={skill.id}
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            selectedSkillIds,
                            setSelectedSkillIds
                          )
                        }
                        disabled={saving}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`skill-${skill.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {skill.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Языки
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableLanguages.length === 0 && (
                    <span className="text-sm text-gray-500 col-span-full">
                      Загрузка языков...
                    </span>
                  )}
                  {availableLanguages.map((lang) => (
                    <div key={lang.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`lang-${lang.id}`}
                        value={lang.id}
                        checked={selectedLanguageIds.includes(lang.id)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            selectedLanguageIds,
                            setSelectedLanguageIds
                          )
                        }
                        disabled={saving}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`lang-${lang.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {lang.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/* Профиль клиента */}
        {typedUser.profile?.role === "CLIENT" && (
          <fieldset className="border p-4 rounded-md">
            <legend className="text-lg font-semibold px-2 text-gray-700">
              Информация о клиенте
            </legend>
            <div className="space-y-4 mt-2">
              <div>
                <label
                  htmlFor="requestDetails"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  О вашем запросе (опционально)
                </label>
                <textarea
                  id="requestDetails"
                  value={requestDetails}
                  onChange={(e) => setRequestDetails(e.target.value)}
                  rows={4}
                  disabled={saving}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Интересующие темы
                </label>
                <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableSkills.length === 0 && (
                    <span className="text-sm text-gray-500 col-span-full">
                      Загрузка тем...
                    </span>
                  )}
                  {availableSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`topic-${skill.id}`}
                        value={skill.id}
                        checked={selectedTopicIds.includes(skill.id)}
                        onChange={(e) =>
                          handleCheckboxChange(
                            e,
                            selectedTopicIds,
                            setSelectedTopicIds
                          )
                        }
                        disabled={saving}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor={`topic-${skill.id}`}
                        className="ml-2 text-sm text-gray-700"
                      >
                        {skill.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </fieldset>
        )}

        {/* Кнопка отправки */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || loadingData}
            className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <LoadingSpinner /> : "Сохранить изменения"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditPage;
