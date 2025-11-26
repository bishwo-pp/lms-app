import React, { useState, useEffect } from 'react';
import { BookOpen, Video, Users, Award, BarChart, LogOut, Menu, X, Play, Check, Clock, Star } from 'lucide-react';

// Mock Supabase client (replace with actual Supabase in production)
const mockSupabase = {
  auth: {
    signUp: async (credentials) => {
      const user = { id: Date.now(), email: credentials.email };
      localStorage.setItem('lms_user', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signIn: async (credentials) => {
      const user = { id: Date.now(), email: credentials.email };
      localStorage.setItem('lms_user', JSON.stringify(user));
      return { data: { user }, error: null };
    },
    signOut: async () => {
      localStorage.removeItem('lms_user');
      return { error: null };
    },
    getUser: () => {
      const user = localStorage.getItem('lms_user');
      return user ? JSON.parse(user) : null;
    }
  }
};

// Sample course data
const sampleCourses = [
  {
    id: 1,
    title: 'React Fundamentals',
    description: 'Master React from basics to advanced concepts with hands-on projects',
    instructor: 'Sarah Johnson',
    duration: '12 hours',
    lessons: 24,
    students: 1234,
    rating: 4.8,
    level: 'Beginner',
    category: 'Web Development',
    thumbnail: '📱',
    progress: 0,
    modules: [
      { id: 1, title: 'Introduction to React', duration: '45 min', completed: false },
      { id: 2, title: 'Components & Props', duration: '1 hour', completed: false },
      { id: 3, title: 'State Management', duration: '1.5 hours', completed: false },
      { id: 4, title: 'Hooks Deep Dive', duration: '2 hours', completed: false }
    ]
  },
  {
    id: 2,
    title: 'JavaScript Mastery',
    description: 'Complete JavaScript course covering ES6+, async programming, and modern patterns',
    instructor: 'Mike Chen',
    duration: '18 hours',
    lessons: 32,
    students: 2156,
    rating: 4.9,
    level: 'Intermediate',
    category: 'Programming',
    thumbnail: '⚡',
    progress: 0,
    modules: [
      { id: 1, title: 'Modern JavaScript Basics', duration: '1 hour', completed: false },
      { id: 2, title: 'ES6+ Features', duration: '1.5 hours', completed: false },
      { id: 3, title: 'Async JavaScript', duration: '2 hours', completed: false },
      { id: 4, title: 'Design Patterns', duration: '1.5 hours', completed: false }
    ]
  },
  {
    id: 3,
    title: 'Full-Stack Web Development',
    description: 'Build complete web applications from frontend to backend deployment',
    instructor: 'Emily Rodriguez',
    duration: '25 hours',
    lessons: 45,
    students: 987,
    rating: 4.7,
    level: 'Advanced',
    category: 'Web Development',
    thumbnail: '🚀',
    progress: 0,
    modules: [
      { id: 1, title: 'Frontend Fundamentals', duration: '3 hours', completed: false },
      { id: 2, title: 'Backend Development', duration: '4 hours', completed: false },
      { id: 3, title: 'Database Design', duration: '2 hours', completed: false },
      { id: 4, title: 'Deployment & DevOps', duration: '2 hours', completed: false }
    ]
  },
  {
    id: 4,
    title: 'Python for Data Science',
    description: 'Learn Python programming and data analysis with pandas, numpy, and matplotlib',
    instructor: 'David Kim',
    duration: '20 hours',
    lessons: 38,
    students: 1567,
    rating: 4.8,
    level: 'Beginner',
    category: 'Data Science',
    thumbnail: '🐍',
    progress: 0,
    modules: [
      { id: 1, title: 'Python Basics', duration: '2 hours', completed: false },
      { id: 2, title: 'Data Structures', duration: '2 hours', completed: false },
      { id: 3, title: 'Pandas & NumPy', duration: '3 hours', completed: false },
      { id: 4, title: 'Data Visualization', duration: '2 hours', completed: false }
    ]
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    description: 'Create beautiful and user-friendly interfaces with modern design principles',
    instructor: 'Lisa Wang',
    duration: '15 hours',
    lessons: 28,
    students: 892,
    rating: 4.9,
    level: 'Beginner',
    category: 'Design',
    thumbnail: '🎨',
    progress: 0,
    modules: [
      { id: 1, title: 'Design Fundamentals', duration: '1.5 hours', completed: false },
      { id: 2, title: 'User Research', duration: '2 hours', completed: false },
      { id: 3, title: 'Prototyping', duration: '2 hours', completed: false },
      { id: 4, title: 'Usability Testing', duration: '1.5 hours', completed: false }
    ]
  },
  {
    id: 6,
    title: 'Mobile App Development',
    description: 'Build native mobile apps for iOS and Android with React Native',
    instructor: 'James Park',
    duration: '22 hours',
    lessons: 40,
    students: 1123,
    rating: 4.7,
    level: 'Intermediate',
    category: 'Mobile Development',
    thumbnail: '📱',
    progress: 0,
    modules: [
      { id: 1, title: 'React Native Basics', duration: '2 hours', completed: false },
      { id: 2, title: 'Navigation', duration: '1.5 hours', completed: false },
      { id: 3, title: 'State Management', duration: '2 hours', completed: false },
      { id: 4, title: 'Publishing Apps', duration: '1.5 hours', completed: false }
    ]
  }
];

function App() {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = mockSupabase.auth.getUser();
    if (storedUser) {
      setUser(storedUser);
      const stored = localStorage.getItem('lms_enrolled');
      if (stored) {
        setEnrolledCourses(JSON.parse(stored));
      }
    }
  }, []);

  const handleEnroll = (courseId) => {
    const course = sampleCourses.find(c => c.id === courseId);
    const newEnrolled = [...enrolledCourses, course];
    setEnrolledCourses(newEnrolled);
    localStorage.setItem('lms_enrolled', JSON.stringify(newEnrolled));
  };

  const handleModuleComplete = (courseId, moduleId) => {
    const updated = enrolledCourses.map(course => {
      if (course.id === courseId) {
        const updatedModules = course.modules.map(m => 
          m.id === moduleId ? { ...m, completed: true } : m
        );
        const completedCount = updatedModules.filter(m => m.completed).length;
        const progress = Math.round((completedCount / updatedModules.length) * 100);
        return { ...course, modules: updatedModules, progress };
      }
      return course;
    });
    setEnrolledCourses(updated);
    localStorage.setItem('lms_enrolled', JSON.stringify(updated));
  };

  if (!user) {
    return <AuthPage setUser={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎓</div>
              <h1 className="text-2xl font-bold text-gray-900">LearnHub</h1>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setCurrentView('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  currentView === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen size={20} />
                <span>My Learning</span>
              </button>
              <button
                onClick={() => setCurrentView('browse')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
                  currentView === 'browse' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Video size={20} />
                <span>Browse Courses</span>
              </button>
              <div className="flex items-center gap-3 ml-4 pl-4 border-l">
                <span className="text-sm text-gray-600">{user.email}</span>
                <button
                  onClick={async () => {
                    await mockSupabase.auth.signOut();
                    setUser(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left mb-2"
              >
                <BookOpen size={20} />
                <span>My Learning</span>
              </button>
              <button
                onClick={() => {
                  setCurrentView('browse');
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left mb-2"
              >
                <Video size={20} />
                <span>Browse Courses</span>
              </button>
              <div className="pt-2 border-t mt-2">
                <p className="text-sm text-gray-600 px-3 mb-2">{user.email}</p>
                <button
                  onClick={async () => {
                    await mockSupabase.auth.signOut();
                    setUser(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 bg-red-500 text-white rounded-lg"
                >
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            enrolledCourses={enrolledCourses} 
            setSelectedCourse={setSelectedCourse}
            handleModuleComplete={handleModuleComplete}
            user={user}
          />
        )}
        {currentView === 'browse' && (
          <BrowseCourses 
            courses={sampleCourses} 
            enrolledCourses={enrolledCourses}
            handleEnroll={handleEnroll}
          />
        )}
        {selectedCourse && (
          <CoursePlayer 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)}
            onModuleComplete={handleModuleComplete}
          />
        )}
      </main>
    </div>
  );
}

function AuthPage({ setUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);

    try {
      const { data, error } = isSignUp
        ? await mockSupabase.auth.signUp({ email, password })
        : await mockSupabase.auth.signIn({ email, password });

      if (error) throw error;
      setUser(data.user);
    } catch (error) {
      alert(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LearnHub</h1>
          <p className="text-gray-600">Your journey to mastery starts here</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleAuth}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="ml-2 text-blue-600 font-semibold hover:underline"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ enrolledCourses, setSelectedCourse, handleModuleComplete, user }) {
  const totalProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
    : 0;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user.email.split('@')[0]}! 👋
        </h2>
        <p className="text-gray-600">Continue your learning journey</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <BarChart className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold text-gray-900">{totalProgress}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Award className="text-purple-600" size={24} />
            </div>
            <div>
              <p className="text-gray-600 text-sm">Certificates</p>
              <p className="text-2xl font-bold text-gray-900">
                {enrolledCourses.filter(c => c.progress === 100).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses yet</h3>
          <p className="text-gray-600 mb-4">Start learning by browsing our course catalog</p>
        </div>
      ) : (
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <EnrolledCourseCard
                key={course.id}
                course={course}
                onClick={() => setSelectedCourse(course)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function EnrolledCourseCard({ course, onClick }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-32 flex items-center justify-center">
        <div className="text-6xl">{course.thumbnail}</div>
      </div>
      
      <div className="p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{course.instructor}</p>
        
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={onClick}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Continue Learning
        </button>
      </div>
    </div>
  );
}

function BrowseCourses({ courses, enrolledCourses, handleEnroll }) {
  const [filter, setFilter] = useState('all');
  
  const categories = ['all', ...new Set(courses.map(c => c.category))];
  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(c => c.category === filter);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Browse Courses</h2>
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filter === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {cat === 'all' ? 'All Courses' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            isEnrolled={enrolledCourses.some(c => c.id === course.id)}
            onEnroll={handleEnroll}
          />
        ))}
      </div>
    </div>
  );
}

function CourseCard({ course, isEnrolled, onEnroll }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition">
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-40 flex items-center justify-center">
        <div className="text-7xl">{course.thumbnail}</div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded font-medium">
            {course.level}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {course.category}
          </span>
        </div>

        <h4 className="text-lg font-bold text-gray-900 mb-2">{course.title}</h4>
        <p className="text-sm text-gray-600 mb-4">{course.description}</p>
        
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span>{course.students.toLocaleString()} students</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
            <span>{course.rating} ({course.lessons} lessons)</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4">by {course.instructor}</p>

        <button
          onClick={() => onEnroll(course.id)}
          disabled={isEnrolled}
          className={`w-full py-2 rounded-lg font-semibold transition ${
            isEnrolled
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isEnrolled ? 'Already Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
}

function CoursePlayer({ course, onClose, onModuleComplete }) {
  const [currentModule, setCurrentModule] = useState(0);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-2xl font-bold text-gray-900">{course.title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="bg-gray-900 rounded-lg aspect-video mb-6 flex items-center justify-center">
            <Play size={64} className="text-white" />
          </div>

          <h4 className="text-xl font-bold text-gray-900 mb-4">
            {course.modules[currentModule].title}
          </h4>

          <div className="space-y-2 mb-6">
            {course.modules.map((module, idx) => (
              <div
                key={module.id}
                className={`p-4 rounded-lg border cursor-pointer transition ${
                  idx === currentModule
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => setCurrentModule(idx)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {module.completed ? (
                      <Check className="text-green-600" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{module.title}</p>
                      <p className="text-sm text-gray-600">{module.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              onModuleComplete(course.id, course.modules[currentModule].id);
              if (currentModule < course.modules.length - 1) {
                setCurrentModule(currentModule + 1);
              }
            }}
            disabled={course.modules[currentModule].completed}
            className={`w-full py-3 rounded-lg font-semibold transition ${
              course.modules[currentModule].completed
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {course.modules[currentModule].completed ? 'Completed' : 'Mark as Complete'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
