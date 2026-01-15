import React, {useState} from 'react';
import {useSchedule} from '../contexts/ScheduleContext';
import {ProjectCard} from './ProjectCard';

export const MainContent: React.FC = () => {
    const {currentSchedule, loading, addProject} = useSchedule();
    const [isAddingProject, setIsAddingProject] = useState(false);
    const [newProjectName, setNewProjectName] = useState('');

    const handleAddProject = () => {
        if (!newProjectName.trim()) return;

        addProject(newProjectName);
        setNewProjectName('');
        setIsAddingProject(false);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500">로딩 중...</p>
                </div>
            </div>
        );
    }

    if (!currentSchedule) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <svg className="w-20 h-20 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <p className="text-xl text-gray-500">스케줄을 불러올 수 없습니다.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-gray-100">
            {currentSchedule.projects.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center max-w-lg">
                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center">
                            <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">시작해볼까요?</h3>
                        <p className="text-gray-500 mb-6">
                            새 프로젝트를 추가하고<br/>
                            오늘의 일정을 계획해보세요!
                        </p>

                        {/* 프로젝트 추가 폼 */}
                        {isAddingProject ? (
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[400px]">
                                <input
                                    type="text"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddProject()}
                                    placeholder="프로젝트 이름을 입력하세요"
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white mb-4"
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleAddProject}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
                                    >
                                        추가
                                    </button>
                                    <button
                                        onClick={() => {
                                            setIsAddingProject(false);
                                            setNewProjectName('');
                                        }}
                                        className="flex-1 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md font-medium cursor-pointer"
                                    >
                                        취소
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setIsAddingProject(true)}
                                className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-6 py-3 rounded-lg hover:bg-blue-100 transition-colors font-medium cursor-pointer"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                                </svg>
                                <span>프로젝트 추가하기</span>
                            </button>
                        )}
                    </div>
                </div>
            ) : (
                <div className="max-w-5xl mx-auto h-full flex flex-col">
                    {/* 상단 고정 영역 */}
                    <div className="mb-6 flex-shrink-0">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            오늘의 프로젝트
                        </h2>
                        <p className="text-gray-500">
                            총 {currentSchedule.projects.length}개의 프로젝트가 있습니다.
                        </p>
                    </div>

                    {/* 스크롤 영역 */}
                    <div className="flex-1 overflow-y-auto ">
                        {currentSchedule.projects.map((project) => (
                            <ProjectCard key={project.id} project={project} />
                        ))}
                    </div>
                </div>

            )}
        </div>
    );
};
