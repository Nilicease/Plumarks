import {
  AlertTriangle,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Pencil,
  Plus,
  Trash2,
  Trophy,
  X,
} from "lucide-react";
import { Topbar } from "../components/Topbar";
import { PageSkeleton } from "../components/ui/Skeleton";
import { useAsyncPageLoading } from "../hooks/useAsyncPageLoading";
import { useTaskManager } from "../hooks/useTaskManager";
import { categoryPercentage, taskPercentage } from "../utils/gradeUtils";

export function TasksPage() {
  const isLoading = useAsyncPageLoading();
  const {
    subjects,
    openSubjects,
    openCategories,
    isTaskModalOpen,
    selectedSubject,
    selectedCategory,
    selectedSubcategory,
    taskName,
    earnedScore,
    possibleScore,
    editingTask,
    pendingDelete,
    currentSubject,
    currentCategory,
    taskCount,
    setIsTaskModalOpen,
    setSelectedSubcategory,
    setTaskName,
    setEarnedScore,
    setPossibleScore,
    setPendingDelete,
    toggleSubject,
    toggleCategory,
    openTaskModal,
    openEditTask,
    handleSubjectChange,
    handleCategoryChange,
    removeTask,
    confirmRemoveTask,
    handleTaskSubmit,
  } = useTaskManager();
  const average = subjects.length
    ? Math.round(
        subjects.reduce((total, subject) => total + subject.grade, 0) /
          subjects.length,
      )
    : null;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
        <div className="mx-auto max-w-[1120px]">
          <Topbar />
          <PageSkeleton />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#eefafa_0%,var(--plumarks-background)_52%,#f1f8f8_100%)] px-4 py-5 font-sans text-text sm:px-8 sm:py-8">
      <div className="mx-auto max-w-[1120px]">
        <Topbar />

        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 flex items-center gap-2 text-[0.75rem] font-bold uppercase tracking-[0.12em] text-primary">
              <BookOpen size={14} strokeWidth={2.4} aria-hidden="true" /> Task
              performance
            </p>
            <h1 className="m-0 mb-2 font-serif text-[clamp(2.5rem,5vw,4.4rem)] font-normal leading-[0.95] tracking-[-0.05em]">
              All tasks
            </h1>
            <p className="m-0 max-w-[580px] text-[0.95rem] leading-[1.6] text-text-secondary">
              Review every task behind your current subject grades.
            </p>
          </div>
          <button
            type="button"
            onClick={openTaskModal}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white transition hover:bg-primary-dark"
          >
            <Plus size={16} strokeWidth={2.5} aria-hidden="true" />
            Add task
          </button>
        </section>

        <section
          className="mb-8 grid gap-4 sm:grid-cols-3"
          aria-label="Performance summary"
        >
          <div className="rounded-[18px] bg-primary-dark p-5 text-white shadow-[0_18px_45px_rgba(18,93,101,0.16)] sm:p-6">
            <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-[#a6d9da]">
              Overall average
            </p>
            <p className="m-0 mt-3 font-serif text-[3.4rem] leading-none tracking-[-0.06em]">
              {average ?? "—"}
              <span className="text-[1.7rem] text-[#8ee1df]">
                {average === null ? "" : "%"}
              </span>
            </p>
          </div>
          <div className="rounded-[18px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(18,93,101,0.06)] sm:p-6">
            <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-text-muted">
              Subjects
            </p>
            <p className="m-0 mt-3 font-serif text-[3.4rem] leading-none tracking-[-0.06em]">
              {subjects.length}
            </p>
          </div>
          <div className="rounded-[18px] border border-border bg-surface p-5 shadow-[0_12px_30px_rgba(18,93,101,0.06)] sm:p-6">
            <p className="m-0 text-[0.75rem] font-bold uppercase tracking-[0.1em] text-text-muted">
              Tasks recorded
            </p>
            <p className="m-0 mt-3 font-serif text-[3.4rem] leading-none tracking-[-0.06em]">
              {taskCount}
            </p>
          </div>
        </section>

        <section className="space-y-4">
          {subjects.length === 0 && (
            <p className="rounded-[16px] border border-border bg-surface p-6 text-sm text-text-secondary">
              No tasks are available yet. Add a subject first, then connect
              grade records when the backend grade API is available.
            </p>
          )}
          {subjects.map((subject) => {
            const subjectOpen = openSubjects[subject.name];
            return (
              <article
                key={subject.name}
                className="overflow-hidden rounded-[20px] border border-border bg-surface shadow-[0_12px_30px_rgba(18,93,101,0.06)]"
              >
                <button
                  type="button"
                  aria-expanded={subjectOpen}
                  className="flex w-full items-center gap-4 p-5 text-left transition hover:bg-[#f8fffe] sm:p-6"
                  onClick={() => toggleSubject(subject.name)}
                >
                  <span
                    className="h-12 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: subject.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="font-serif text-[1.55rem] font-normal">
                        {subject.name}
                      </span>
                      <span className="text-[0.75rem] font-bold text-text-muted">
                        {subject.teacher}
                      </span>
                    </span>
                    <span className="mt-1 block text-[0.78rem] text-text-secondary">
                      {subject.categories.length} categories ·{" "}
                      {subject.categories.reduce(
                        (total, category) => total + category.tasks.length,
                        0,
                      )}{" "}
                      tasks recorded
                    </span>
                  </span>
                  <span className="hidden text-right sm:block">
                    <span className="block font-serif text-[1.9rem] leading-none">
                      {subject.grade}%
                    </span>
                    <span className="mt-1 block text-[0.7rem] font-bold uppercase tracking-[0.08em] text-text-muted">
                      Final grade
                    </span>
                  </span>
                  {subjectOpen ? (
                    <ChevronUp
                      size={19}
                      className="shrink-0 text-primary-dark"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDown
                      size={19}
                      className="shrink-0 text-primary-dark"
                      aria-hidden="true"
                    />
                  )}
                </button>

                {subjectOpen && (
                  <div className="border-t border-border bg-[#fbfdfd] p-4 sm:p-6">
                    <div className="mb-4 flex items-center justify-between gap-3 sm:hidden">
                      <span className="text-[0.72rem] font-bold uppercase tracking-[0.08em] text-text-muted">
                        Final grade
                      </span>
                      <span className="font-serif text-[1.5rem]">
                        {subject.grade}%
                      </span>
                    </div>
                    <div className="space-y-3">
                      {subject.categories.map((category) => {
                        const categoryKey = `${subject.name}-${category.name}`;
                        const categoryOpen =
                          openCategories[categoryKey] ?? true;
                        const percentage = categoryPercentage(category);
                        return (
                          <div
                            key={categoryKey}
                            className="rounded-[14px] border border-border bg-white"
                          >
                            <button
                              type="button"
                              aria-expanded={categoryOpen}
                              className="flex w-full items-center gap-3 p-4 text-left"
                              onClick={() => toggleCategory(categoryKey)}
                            >
                              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary-dark">
                                <Trophy
                                  size={15}
                                  strokeWidth={2.1}
                                  aria-hidden="true"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block font-bold text-[0.9rem]">
                                  {category.name}
                                </span>
                                <span className="mt-1 block text-[0.72rem] text-text-muted">
                                  {category.weight}% of final grade ·{" "}
                                  {category.tasks.length}{" "}
                                  {category.tasks.length === 1
                                    ? "task"
                                    : "tasks"}
                                </span>
                              </span>
                              <span className="mr-1 text-right">
                                <span className="block font-serif text-[1.25rem]">
                                  {percentage}%
                                </span>
                                <span className="block text-[0.65rem] uppercase tracking-[0.08em] text-text-muted">
                                  Category
                                </span>
                              </span>
                              {categoryOpen ? (
                                <ChevronUp
                                  size={16}
                                  className="text-text-muted"
                                  aria-hidden="true"
                                />
                              ) : (
                                <ChevronDown
                                  size={16}
                                  className="text-text-muted"
                                  aria-hidden="true"
                                />
                              )}
                            </button>
                            {categoryOpen && (
                              <div className="border-t border-border px-4 pb-3">
                                {category.tasks.map((task, taskIndex) => {
                                  const taskGrade = taskPercentage(task);
                                  return (
                                    <div
                                      key={`${task.name}-${taskIndex}`}
                                      className="flex items-center gap-3 border-b border-border py-3 last:border-0"
                                    >
                                      <span
                                        className={`h-2 w-2 shrink-0 rounded-full ${taskGrade >= 80 ? "bg-success" : "bg-warning"}`}
                                      />
                                      <span className="min-w-0 flex-1">
                                        <span className="block text-[0.83rem]">
                                          {task.name}
                                        </span>
                                        {task.subcategory && (
                                          <span className="mt-0.5 block text-[0.68rem] text-text-muted">
                                            {task.subcategory}
                                          </span>
                                        )}
                                      </span>
                                      <span className="text-right">
                                        <span className="block text-[0.84rem] font-bold">
                                          {task.earned}/{task.possible}
                                        </span>
                                        <span className="block text-[0.68rem] text-text-muted">
                                          {taskGrade}%
                                        </span>
                                      </span>
                                      <span className="flex shrink-0 items-center gap-1">
                                        <button
                                          type="button"
                                          aria-label={`Edit ${task.name}`}
                                          title={`Edit ${task.name}`}
                                          onClick={() =>
                                            openEditTask(
                                              subject.name,
                                              category.name,
                                              taskIndex,
                                              task,
                                            )
                                          }
                                          className="flex h-8 w-8 items-center justify-center rounded-[7px] text-text-muted hover:bg-primary-light hover:text-primary-dark"
                                        >
                                          <Pencil
                                            size={14}
                                            aria-hidden="true"
                                          />
                                        </button>
                                        <button
                                          type="button"
                                          aria-label={`Remove ${task.name}`}
                                          title={`Remove ${task.name}`}
                                          onClick={() =>
                                            removeTask(
                                              subject.name,
                                              category.name,
                                              taskIndex,
                                            )
                                          }
                                          className="flex h-8 w-8 items-center justify-center rounded-[7px] text-text-muted hover:bg-[#feeceb] hover:text-danger"
                                        >
                                          <Trash2
                                            size={14}
                                            aria-hidden="true"
                                          />
                                        </button>
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </div>

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[60] flex min-h-full items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.46)] p-4"
          role="presentation"
        >
          <div
            className="my-2 w-full max-w-[420px] rounded-[18px] bg-surface p-6 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:my-8"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="remove-task-title"
          >
            <div className="mb-5 flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#feeceb] text-danger">
                <AlertTriangle size={19} aria-hidden="true" />
              </span>
              <div>
                <h2
                  id="remove-task-title"
                  className="m-0 text-[1.05rem] font-bold"
                >
                  Remove this task?
                </h2>
                <p className="m-0 mt-1 text-[0.84rem] leading-[1.5] text-text-secondary">
                  “{pendingDelete.taskName}” will be removed from your
                  performance records.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="min-h-[42px] rounded-[9px] px-4 text-[0.82rem] font-bold text-text-secondary hover:bg-primary-light"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRemoveTask}
                className="min-h-[42px] rounded-[9px] bg-danger px-4 text-[0.82rem] font-bold text-white hover:opacity-90"
              >
                Remove task
              </button>
            </div>
          </div>
        </div>
      )}

      {isTaskModalOpen && currentSubject && currentCategory && (
        <div
          className="fixed inset-0 z-50 flex min-h-full items-start justify-center overflow-y-auto bg-[rgba(15,23,42,0.46)] p-4"
          role="presentation"
        >
          <div
            className="my-2 w-full max-w-[560px] rounded-[22px] bg-surface p-5 shadow-[0_28px_80px_rgba(15,23,42,0.22)] sm:my-6 sm:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-task-title"
          >
            <div className="mb-7 flex items-start justify-between gap-4">
              <div>
                <p className="mb-2 text-[0.72rem] font-bold uppercase tracking-[0.12em] text-primary">
                  New performance record
                </p>
                <h2
                  id="add-task-title"
                  className="m-0 font-serif text-[2rem] font-normal leading-none tracking-[-0.04em]"
                >
                  {editingTask ? "Edit task" : "Add a task"}
                </h2>
                <p className="m-0 mt-2 text-[0.84rem] leading-[1.5] text-text-secondary">
                  Choose where it belongs, then record the score.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close add task dialog"
                title="Close"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] text-text-muted transition hover:bg-primary-light hover:text-primary-dark"
                onClick={() => setIsTaskModalOpen(false)}
              >
                <X size={18} aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[0.8rem] font-bold"
                    htmlFor="task-subject"
                  >
                    Subject
                  </label>
                  <select
                    id="task-subject"
                    value={selectedSubject}
                    disabled={!!editingTask}
                    onChange={(event) =>
                      handleSubjectChange(event.target.value)
                    }
                    className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {subjects.map((subject) => (
                      <option key={subject.name} value={subject.name}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[0.8rem] font-bold"
                    htmlFor="task-category"
                  >
                    Category
                  </label>
                  <select
                    id="task-category"
                    value={selectedCategory}
                    disabled={!!editingTask}
                    onChange={(event) =>
                      handleCategoryChange(event.target.value)
                    }
                    className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {currentSubject.categories.map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {currentCategory.subcategories && (
                <div className="flex flex-col gap-2">
                  <label
                    className="text-[0.8rem] font-bold"
                    htmlFor="task-subcategory"
                  >
                    Sub-category{" "}
                    <span className="font-normal text-text-muted">
                      (optional)
                    </span>
                  </label>
                  <select
                    id="task-subcategory"
                    value={selectedSubcategory}
                    onChange={(event) =>
                      setSelectedSubcategory(event.target.value)
                    }
                    className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]"
                  >
                    <option value="">Select a sub-category</option>
                    {currentCategory.subcategories.map((subcategory) => (
                      <option key={subcategory} value={subcategory}>
                        {subcategory}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="text-[0.8rem] font-bold" htmlFor="task-name">
                  Task name
                </label>
                <input
                  id="task-name"
                  value={taskName}
                  onChange={(event) => setTaskName(event.target.value)}
                  placeholder="e.g. Performance task 3"
                  className="min-h-[48px] rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]"
                  required
                />
              </div>

              <div>
                <p className="m-0 mb-2 text-[0.8rem] font-bold">Score</p>
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <input
                    aria-label="Score earned"
                    type="number"
                    min="0"
                    value={earnedScore}
                    onChange={(event) => setEarnedScore(event.target.value)}
                    placeholder="10"
                    className="min-h-[48px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]"
                    required
                  />
                  <span className="font-serif text-[1.3rem] text-text-muted">
                    /
                  </span>
                  <input
                    aria-label="Score possible"
                    type="number"
                    min="1"
                    value={possibleScore}
                    onChange={(event) => setPossibleScore(event.target.value)}
                    placeholder="20"
                    className="min-h-[48px] w-full rounded-[10px] border border-border bg-[#fbfdfd] px-3 text-[0.9rem] outline-none focus:border-primary focus:shadow-[0_0_0_4px_var(--plumarks-primary-light)]"
                    required
                  />
                </div>
                <p className="m-0 mt-2 text-[0.72rem] text-text-muted">
                  Enter the points earned over the total possible points, for
                  example 10 / 20.
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="min-h-[46px] rounded-[10px] px-5 text-[0.84rem] font-bold text-text-secondary transition hover:bg-[#f1f5f5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-[10px] bg-primary px-5 text-[0.84rem] font-bold text-white transition hover:bg-primary-dark"
                >
                  <Pencil size={16} strokeWidth={2.2} aria-hidden="true" />
                  {editingTask ? "Save changes" : "Add task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
