class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
<<<<<<< HEAD
=======
  before_action :authenticate_user!
>>>>>>> d6e4864157f4e06b206409147fa69fc9166e9abd
end
