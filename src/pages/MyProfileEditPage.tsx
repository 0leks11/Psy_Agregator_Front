import React, {
  useState,
  useEffect,
  useCallback,
  ChangeEvent,
  FormEvent,
} from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getSkills,
  getLanguages,
  updateBaseProfile,
  updateProfilePicture,
  updateTherapistProfile,
  updateClientProfile,
  addMyPhoto,
  deleteMyPhoto,
  getMyPublications,
  createMyPublication,
  deleteMyPublication,
} from "../services/profileService";
import {
  FullUserData,
  Skill,
  Language,
  Gender,
  TherapistPhotoData,
  PublicationData,
  TherapistProfileEditData,
} from "../types/models";
import LoadingSpinner from "../components/common/LoadingSpinner";
import ErrorMessage from "../components/common/ErrorMessage";

// Интерфейс для данных формы
interface ProfileFormData {
  firstName: string;
  lastName: string;
  gender: string;
  about: string;
  experience_years: string;
  total_hours_worked: string;
  display_hours: boolean;
  office_location: string;
  request_details: string;
  profilePictureFile: File | null;
  video_intro_url: string;
  website_url: string;
  linkedin_url: string;
}

// Вспомогательная функция для извлечения ID из массива объектов/чисел
const getIds = (items: { id: number }[] | undefined): number[] =>
  items ? items.map((item) => item.id) : [];

const MyProfileEditPage: React.FC = () => {
  const { user, updateUserState } = useAuth();
  const navigate = useNavigate();

  // --- Состояния ---
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    gender: "UNKNOWN",
    about: "",
    experience_years: "0",
    total_hours_worked: "",
    display_hours: false,
    office_location: "",
    request_details: "",
    profilePictureFile: null,
    video_intro_url: "",
    website_url: "",
    linkedin_url: "",
  });

  const [picturePreview, setPicturePreview] = useState<string | null>(null);

  // Для фото и публикаций
  const [myPhotos, setMyPhotos] = useState<TherapistPhotoData[]>([]);
  const [myPublications, setMyPublications] = useState<PublicationData[]>([]);
  const [photoUploadLoading, setPhotoUploadLoading] = useState(false);
  const [photoDeleteLoading, setPhotoDeleteLoading] = useState<number | null>(
    null
  ); // Храним ID удаляемого фото

  // Для select полей
  const [selectedSkillIds, setSelectedSkillIds] = useState<number[]>([]);
  const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([]);
  const [selectedTopicIds, setSelectedTopicIds] = useState<number[]>([]);

  // Данные для выбора
  const [availableSkills, setAvailableSkills] = useState<Skill[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);

  // Состояния UI
  const [loadingLists, setLoadingLists] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Загрузка справочников (навыки, языки) ---
  const loadSelectionLists = useCallback(async () => {
    setLoadingLists(true);
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
      setLoadingLists(false);
    }
  }, []);

  // --- Загрузка Фото и Публикаций ---
  const loadMyContent = useCallback(
    async (currentUser: FullUserData | null) => {
      if (
        !currentUser ||
        currentUser.profile?.role !== "THERAPIST" ||
        !currentUser.therapist_profile
      ) {
        setMyPhotos([]); // Очищаем если не терапевт
        setMyPublications([]);
        return;
      }

      // Фото уже должны быть в therapist_profile при загрузке user
      setMyPhotos(currentUser.therapist_profile.photos || []);

      // Загружаем публикации отдельно
      try {
        const pubs = await getMyPublications();
        setMyPublications(pubs);
      } catch (err) {
        console.error("Failed to load my publications", err);
        // Можно установить ошибку для отображения
      }
    },
    []
  );

  // --- Инициализация формы (обновить новыми полями) ---
  const initializeForm = useCallback(
    (currentUser: FullUserData | null) => {
      if (!currentUser) return;
      setAuthLoading(false);

      setFormData((prev) => ({
        // Используем prev чтобы не перезатереть file
        ...prev, // Сохраняем profilePictureFile если он был выбран до загрузки user
        firstName: currentUser.first_name || "",
        lastName: currentUser.last_name || "",
        gender: currentUser.profile?.gender || "UNKNOWN",
        // --- Поля терапевта ---
        about: currentUser.therapist_profile?.about || "",
        experience_years: String(
          currentUser.therapist_profile?.experience_years ?? "0"
        ),
        total_hours_worked: String(
          currentUser.therapist_profile?.total_hours_worked ?? ""
        ),
        display_hours: currentUser.therapist_profile?.display_hours ?? false,
        office_location: currentUser.therapist_profile?.office_location || "",
        video_intro_url: currentUser.therapist_profile?.video_intro_url || "",
        website_url: currentUser.therapist_profile?.website_url || "",
        linkedin_url: currentUser.therapist_profile?.linkedin_url || "",
        // --- Поля клиента ---
        request_details: currentUser.client_profile?.request_details || "",
        // profilePictureFile остается из prev
      }));

      // Установка выбранных навыков, языков и тем
      if (currentUser.therapist_profile) {
        setSelectedSkillIds(
          currentUser.therapist_profile.skills
            ? typeof currentUser.therapist_profile.skills[0] === "object"
              ? getIds(
                  currentUser.therapist_profile.skills as unknown as {
                    id: number;
                  }[]
                )
              : (currentUser.therapist_profile.skills as unknown as number[])
            : []
        );

        setSelectedLanguageIds(
          currentUser.therapist_profile.languages
            ? typeof currentUser.therapist_profile.languages[0] === "object"
              ? getIds(
                  currentUser.therapist_profile.languages as unknown as {
                    id: number;
                  }[]
                )
              : (currentUser.therapist_profile.languages as unknown as number[])
            : []
        );
      }

      if (
        currentUser.client_profile &&
        currentUser.client_profile.interested_topics
      ) {
        if (
          typeof currentUser.client_profile.interested_topics[0] === "object"
        ) {
          setSelectedTopicIds(
            getIds(
              currentUser.client_profile.interested_topics as unknown as {
                id: number;
              }[]
            )
          );
        } else {
          setSelectedTopicIds(
            currentUser.client_profile.interested_topics as unknown as number[]
          );
        }
      }

      setPicturePreview(currentUser.profile?.profile_picture_url || null);

      // Загружаем контент пользователя (фото и посты)
      loadMyContent(currentUser);
    },
    [loadMyContent]
  ); // Добавляем loadMyContent

  // Эффект для загрузки справочников и данных профиля
  useEffect(() => {
    Promise.all([loadSelectionLists()]);

    if (user) {
      initializeForm(user);
    } else {
      setAuthLoading(false);
    }
  }, [loadSelectionLists, initializeForm, user]);

  // --- Обработчики ---
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError("Размер файла изображения не должен превышать 5MB.");
        return;
      }
      setFormData((prev) => ({ ...prev, profilePictureFile: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPicturePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSkillChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const id = parseInt(value, 10);
    if (checked) {
      setSelectedSkillIds((prev) => [...prev, id]);
    } else {
      setSelectedSkillIds((prev) => prev.filter((skillId) => skillId !== id));
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const id = parseInt(value, 10);
    if (checked) {
      setSelectedLanguageIds((prev) => [...prev, id]);
    } else {
      setSelectedLanguageIds((prev) => prev.filter((langId) => langId !== id));
    }
  };

  const handleTopicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const id = parseInt(value, 10);
    if (checked) {
      setSelectedTopicIds((prev) => [...prev, id]);
    } else {
      setSelectedTopicIds((prev) => prev.filter((topicId) => topicId !== id));
    }
  };

  // --- Обработчик загрузки нового фото ---
  const handleAddPhoto = async (photoFile: File) => {
    if (!photoFile) return;
    setPhotoUploadLoading(true);
    setError(null);
    const photoFormData = new FormData();
    photoFormData.append("image", photoFile);
    // Можно добавить caption, order если есть поля для них
    try {
      const newPhoto = await addMyPhoto(photoFormData);
      setMyPhotos((prev) =>
        [...prev, newPhoto].sort((a, b) => a.order - b.order)
      ); // Добавляем и сортируем
      alert("Фото добавлено!");
    } catch (err: any) {
      setError("Не удалось добавить фото.");
      console.error(err);
    } finally {
      setPhotoUploadLoading(false);
      // Очистить input type=file?
    }
  };

  // --- Обработчик удаления фото ---
  const handleDeletePhoto = async (photoId: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить это фото?")) return;
    setPhotoDeleteLoading(photoId); // Показываем лоадер на конкретном фото
    setError(null);
    try {
      await deleteMyPhoto(photoId);
      setMyPhotos((prev) => prev.filter((p) => p.id !== photoId)); // Удаляем из состояния
      alert("Фото удалено!");
    } catch (err: any) {
      setError("Не удалось удалить фото.");
      console.error(err);
    } finally {
      setPhotoDeleteLoading(null);
    }
  };

  // --- Обработчик Сохранения Профиля ---
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    try {
      // 1. Базовый профиль
      const baseUpdateData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        gender: formData.gender,
      };
      let updatedUserData = await updateBaseProfile(baseUpdateData);

      // 2. Картинка профиля
      if (formData.profilePictureFile) {
        const pictureFormData = new FormData();
        pictureFormData.append("profile_picture", formData.profilePictureFile);
        updatedUserData = await updateProfilePicture(pictureFormData);
      }

      // 3. Специфичный профиль
      const isTherapist = user.profile?.role === "THERAPIST";
      const isClient = user.profile?.role === "CLIENT";

      if (isTherapist) {
        const therapistData: Partial<TherapistProfileEditData> = {
          about: formData.about,
          experience_years: parseInt(formData.experience_years, 10) || 0,
          total_hours_worked:
            formData.total_hours_worked === ""
              ? null
              : parseInt(formData.total_hours_worked, 10),
          display_hours: formData.display_hours,
          office_location: formData.office_location,
          skills: selectedSkillIds,
          languages: selectedLanguageIds,
          // Новые поля
          video_intro_url: formData.video_intro_url || null,
          website_url: formData.website_url || null,
          linkedin_url: formData.linkedin_url || null,
        };
        updatedUserData = await updateTherapistProfile(therapistData);
      } else if (isClient) {
        const clientData = {
          request_details: formData.request_details,
          interested_topics: selectedTopicIds,
        };
        updatedUserData = await updateClientProfile(clientData);
      }

      // 4. Обновляем состояние и показываем сообщение
      updateUserState(updatedUserData);
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
  if (authLoading || loadingLists) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Для редактирования профиля необходимо войти в систему." />
      </div>
    );
  }

  const isTherapist = user.profile?.role === "THERAPIST";
  const isClient = user.profile?.role === "CLIENT";

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {" "}
      {/* Увеличим ширину */}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Редактирование профиля
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {error && <ErrorMessage message={error} />}

        {/* --- Основная информация --- */}
        <section className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Основная информация
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Имя
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={saving}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Фамилия
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={saving}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label
                htmlFor="gender"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Пол
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                disabled={saving}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              >
                <option value="MALE">Мужской</option>
                <option value="FEMALE">Женский</option>
                <option value="OTHER">Другой</option>
                <option value="UNKNOWN">Не указывать</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="profilePicture"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Фото профиля
              </label>
              <div className="flex items-center">
                {picturePreview && (
                  <img
                    src={picturePreview}
                    alt="Превью фото профиля"
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                )}
                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={saving}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- Профиль Терапевта --- */}
        {isTherapist && (
          <section className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Профиль терапевта
            </h2>
            <div className="mb-4">
              <label
                htmlFor="about"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                О себе
              </label>
              <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                disabled={saving}
                rows={5}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="experience_years"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Опыт работы (лет)
                </label>
                <input
                  type="number"
                  id="experience_years"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleInputChange}
                  disabled={saving}
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label
                  htmlFor="office_location"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Местоположение / Формат работы
                </label>
                <input
                  type="text"
                  id="office_location"
                  name="office_location"
                  value={formData.office_location}
                  onChange={handleInputChange}
                  disabled={saving}
                  placeholder="Например: Онлайн, Москва"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="total_hours_worked"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Общее количество часов практики
                </label>
                <input
                  type="number"
                  id="total_hours_worked"
                  name="total_hours_worked"
                  value={formData.total_hours_worked}
                  onChange={handleInputChange}
                  disabled={saving}
                  min="0"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  id="display_hours"
                  name="display_hours"
                  checked={formData.display_hours}
                  onChange={handleCheckboxChange}
                  disabled={saving}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="display_hours"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Показывать часы в профиле
                </label>
              </div>
            </div>

            {/* --- Новые поля --- */}
            <div className="mb-4">
              <label
                htmlFor="video_intro_url"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Видео-визитка (URL)
              </label>
              <input
                type="url"
                id="video_intro_url"
                name="video_intro_url"
                value={formData.video_intro_url}
                onChange={handleInputChange}
                disabled={saving}
                placeholder="https://youtube.com/watch?v=..."
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="website_url"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Личный сайт (URL)
                </label>
                <input
                  type="url"
                  id="website_url"
                  name="website_url"
                  value={formData.website_url}
                  onChange={handleInputChange}
                  disabled={saving}
                  placeholder="https://mysite.com"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
              <div>
                <label
                  htmlFor="linkedin_url"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  LinkedIn (URL)
                </label>
                <input
                  type="url"
                  id="linkedin_url"
                  name="linkedin_url"
                  value={formData.linkedin_url}
                  onChange={handleInputChange}
                  disabled={saving}
                  placeholder="https://linkedin.com/in/..."
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            </div>

            {/* --- Навыки и Языки --- */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Навыки и специализации
              </label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSkills.length === 0 ? (
                  <span className="text-gray-500">Загрузка навыков...</span>
                ) : (
                  availableSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`skill-${skill.id}`}
                        value={skill.id}
                        checked={selectedSkillIds.includes(skill.id)}
                        onChange={handleSkillChange}
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
                  ))
                )}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Языки
              </label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableLanguages.length === 0 ? (
                  <span className="text-gray-500">Загрузка языков...</span>
                ) : (
                  availableLanguages.map((lang) => (
                    <div key={lang.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`lang-${lang.id}`}
                        value={lang.id}
                        checked={selectedLanguageIds.includes(lang.id)}
                        onChange={handleLanguageChange}
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
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* --- Профиль Клиента --- */}
        {isClient && (
          <section className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Профиль клиента
            </h2>
            <div className="mb-4">
              <label
                htmlFor="request_details"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                О вашем запросе (опционально)
              </label>
              <textarea
                id="request_details"
                name="request_details"
                value={formData.request_details}
                onChange={handleInputChange}
                disabled={saving}
                rows={4}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring focus:border-blue-300"
              ></textarea>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Интересующие темы
              </label>
              <div className="max-h-48 overflow-y-auto border rounded-md p-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableSkills.length === 0 ? (
                  <span className="text-gray-500">Загрузка тем...</span>
                ) : (
                  availableSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`topic-${skill.id}`}
                        value={skill.id}
                        checked={selectedTopicIds.includes(skill.id)}
                        onChange={handleTopicChange}
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
                  ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* --- Управление Фото (только для терапевта) --- */}
        {isTherapist && (
          <section className="mb-6 border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Фотогалерея
            </h2>
            <div className="mb-4">
              <label
                htmlFor="newPhoto"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Добавить новое фото
              </label>
              <input
                type="file"
                id="newPhoto"
                accept="image/png, image/jpeg, image/webp"
                disabled={saving || photoUploadLoading}
                onChange={(e) =>
                  e.target.files && handleAddPhoto(e.target.files[0])
                }
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {photoUploadLoading && <LoadingSpinner />}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {myPhotos.map((photo) => (
                <div key={photo.id} className="relative group">
                  <img
                    src={photo.image}
                    alt={photo.caption || "Фото"}
                    className="w-full h-32 object-cover rounded-md border"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(photo.id)}
                    disabled={saving || photoDeleteLoading === photo.id}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs disabled:opacity-50"
                    title="Удалить фото"
                  >
                    {photoDeleteLoading === photo.id ? "..." : "✕"}
                  </button>
                  {/* TODO: Добавить редактирование caption/order */}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- Управление Публикациями (только для терапевта) --- */}
        {isTherapist && (
          <section className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-3">
              Мои публикации
            </h2>
            {/* TODO: Добавить кнопку "Создать публикацию" (открывает модалку или новую страницу) */}
            <div className="space-y-3">
              {myPublications.length > 0 ? (
                myPublications.map((pub) => (
                  <div
                    key={pub.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <span>
                      {pub.title} (
                      {pub.is_published ? "Опубликовано" : "Черновик"})
                    </span>
                    <div>
                      {/* TODO: Кнопки Редактировать / Удалить */}
                      <button
                        type="button"
                        className="text-blue-600 hover:underline text-sm mr-2"
                      >
                        Ред.
                      </button>
                      <button
                        type="button"
                        className="text-red-600 hover:underline text-sm"
                      >
                        Удал.
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">
                  У вас пока нет публикаций.
                </p>
              )}
            </div>
          </section>
        )}

        {/* --- Кнопка Сохранения --- */}
        <div className="flex items-center justify-between mt-6">
          <button
            type="submit"
            disabled={
              saving ||
              loadingLists ||
              photoUploadLoading ||
              !!photoDeleteLoading
            }
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            {saving ? <LoadingSpinner /> : "Сохранить все изменения"}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={saving}
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800 disabled:text-gray-400"
          >
            Отмена
          </button>
        </div>
      </form>
    </div>
  );
};

export default MyProfileEditPage;
