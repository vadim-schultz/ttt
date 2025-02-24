from jinja2 import Environment, FileSystemLoader


env = Environment(loader=FileSystemLoader("../templates"))


def test_render_tournaments(tournament_model):
    """Tests Jinja rendering for a tournaments page."""
    template = env.get_template("_tournaments.html")

    rendered_html = template.render(tournaments=[tournament_model, tournament_model])
    assert rendered_html


def test_render_tournament(tournament_model):
    """Tests Jinja rendering for a single tournament page."""
    env = Environment(loader=FileSystemLoader("../templates"))
    template = env.get_template("_tournament.html")

    rendered_html = template.render(tournament=tournament_model)
    assert rendered_html


def test_render_round(round_model):
    """Tests Jinja rendering for a single round page."""
    env = Environment(loader=FileSystemLoader("../templates"))
    template = env.get_template("_round.html")

    rendered_html = template.render(round=round_model)
    assert rendered_html
