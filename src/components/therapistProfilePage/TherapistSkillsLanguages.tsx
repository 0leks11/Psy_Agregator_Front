import React from "react";

interface Props {
  skills: string[];
  languages: string[];
}

const TherapistSkillsLanguages: React.FC<Props> = ({
  skills = [],
  languages = [],
}) => {
  if (skills.length === 0 && languages.length === 0) return null;

  return (
    <section className="mb-8 p-6 bg-white rounded-lg shadow-sm">
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Навыки и специализации
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <span
                key={`skill-${index}`}
                className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
      {languages.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            Языки консультаций
          </h2>
          <p className="text-gray-700">{languages.join(", ")}</p>
        </div>
      )}
    </section>
  );
};

export default TherapistSkillsLanguages;
